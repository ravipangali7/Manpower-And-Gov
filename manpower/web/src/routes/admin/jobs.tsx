import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { SectionPage } from "@/components/admin/ResourceTable";
import { contentBlocksForPage } from "@/components/admin/resource-config";
import { adminApi, type Job } from "@/lib/admin-api";
import { ApiError } from "@/lib/api";
import { invalidatePublicQueries } from "@/lib/public-cache";

export const Route = createFileRoute("/admin/jobs")({
  ssr: false,
  component: AdminJobsPage,
});

type JobForm = {
  title: string;
  company: string;
  sector: string;
  country: string;
  vacancies: string;
  salary: string;
  description: string;
  requirements: string;
  is_active: boolean;
};

const emptyForm: JobForm = {
  title: "",
  company: "",
  sector: "",
  country: "",
  vacancies: "1",
  salary: "",
  description: "",
  requirements: "",
  is_active: true,
};

function AdminJobsPage() {
  const qc = useQueryClient();
  const jobsQuery = useQuery({ queryKey: ["admin", "jobs"], queryFn: () => adminApi.jobs.list() });
  const sectorsQuery = useQuery({
    queryKey: ["admin", "sectors"],
    queryFn: () => adminApi.sectors.list(),
  });
  const countriesQuery = useQuery({
    queryKey: ["admin", "countries"],
    queryFn: () => adminApi.countries.list(),
  });

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Job | null>(null);
  const [form, setForm] = useState<JobForm>(emptyForm);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEdit(job: Job) {
    setEditing(job);
    setForm({
      title: job.title,
      company: job.company,
      sector: String(job.sector),
      country: String(job.country),
      vacancies: String(job.vacancies),
      salary: job.salary || "",
      description: job.description || "",
      requirements: job.requirements || "",
      is_active: job.is_active,
    });
    setOpen(true);
  }

  const saveMutation = useMutation({
    mutationFn: async () => {
      const body = {
        title: form.title,
        company: form.company,
        sector: Number(form.sector),
        country: Number(form.country),
        vacancies: Number(form.vacancies) || 1,
        salary: form.salary,
        description: form.description,
        requirements: form.requirements,
        is_active: form.is_active,
      };
      if (editing) return adminApi.jobs.update(editing.id, body);
      return adminApi.jobs.create(body);
    },
    onSuccess: () => {
      toast.success(editing ? "Job updated" : "Job created");
      setOpen(false);
      void qc.invalidateQueries({ queryKey: ["admin", "jobs"] });
      void qc.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      void invalidatePublicQueries(qc);
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Save failed"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.jobs.remove(id),
    onSuccess: () => {
      toast.success("Job deleted");
      void qc.invalidateQueries({ queryKey: ["admin", "jobs"] });
      void qc.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      void invalidatePublicQueries(qc);
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Delete failed"),
  });

  const jobs = jobsQuery.data ?? [];
  const sectors = sectorsQuery.data ?? [];
  const countries = countriesQuery.data ?? [];

  return (
    <div className="space-y-10">
      <SectionPage
        title="Vacancies"
        description="Manage page copy and vacancy listings shown on /vacancies."
        resources={[contentBlocksForPage("vacancies")]}
      />

      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Job listings</h2>
            <p className="text-sm text-muted-foreground">
              Active jobs appear on the public vacancies page
            </p>
          </div>
          <Button onClick={openCreate}>
            <Plus />
            Add job
          </Button>
        </div>

        {jobsQuery.isLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Sector</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Vacancies</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead className="w-[100px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-muted-foreground">
                      No jobs yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  jobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">{job.title}</TableCell>
                      <TableCell>{job.company}</TableCell>
                      <TableCell>{job.sector_name}</TableCell>
                      <TableCell>{job.country_name}</TableCell>
                      <TableCell>{job.vacancies}</TableCell>
                      <TableCell>{job.is_active ? "Yes" : "No"}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" onClick={() => openEdit(job)}>
                            <Pencil />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              if (confirm("Delete this job?")) deleteMutation.mutate(job.id);
                            }}
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit job" : "Add job"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Company</Label>
              <Input
                value={form.company}
                onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Sector</Label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                  value={form.sector}
                  onChange={(e) => setForm((f) => ({ ...f, sector: e.target.value }))}
                >
                  <option value="">Select…</option>
                  {sectors.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Country</Label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                  value={form.country}
                  onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                >
                  <option value="">Select…</option>
                  {countries.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Vacancies</Label>
                <Input
                  type="number"
                  min={1}
                  value={form.vacancies}
                  onChange={(e) => setForm((f) => ({ ...f, vacancies: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Salary</Label>
                <Input
                  value={form.salary}
                  onChange={(e) => setForm((f) => ({ ...f, salary: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea
                rows={4}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Requirements</Label>
              <Textarea
                rows={3}
                value={form.requirements}
                onChange={(e) => setForm((f) => ({ ...f, requirements: e.target.value }))}
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={form.is_active}
                onCheckedChange={(checked) => setForm((f) => ({ ...f, is_active: checked }))}
              />
              <Label>Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={saveMutation.isPending || !form.title || !form.sector || !form.country}
              onClick={() => saveMutation.mutate()}
            >
              {saveMutation.isPending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
