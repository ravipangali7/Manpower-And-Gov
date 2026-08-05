import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { adminApi } from "@/lib/admin-api";
import { ApiError } from "@/lib/api";

type InquiriesSearch = {
  tab?: "contact" | "partnership" | "registration";
};

export const Route = createFileRoute("/admin/inquiries")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>): InquiriesSearch => ({
    tab:
      search.tab === "partnership" || search.tab === "registration" || search.tab === "contact"
        ? search.tab
        : "contact",
  }),
  component: AdminInquiriesPage,
});

function AdminInquiriesPage() {
  const { tab } = useSearch({ from: "/admin/inquiries" });
  const navigate = Route.useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Inquiries</h1>
        <p className="text-sm text-muted-foreground">Review inbound forms and mark them handled</p>
      </div>
      <Tabs
        value={tab || "contact"}
        onValueChange={(value) =>
          void navigate({
            search: { tab: value as InquiriesSearch["tab"] },
          })
        }
      >
        <TabsList>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="partnership">Partnership</TabsTrigger>
          <TabsTrigger value="registration">Registration</TabsTrigger>
        </TabsList>
        <TabsContent value="contact" className="mt-4">
          <ContactTab />
        </TabsContent>
        <TabsContent value="partnership" className="mt-4">
          <PartnershipTab />
        </TabsContent>
        <TabsContent value="registration" className="mt-4">
          <RegistrationTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ContactTab() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "inquiries", "contact"],
    queryFn: () => adminApi.inquiries.contact.list(),
  });
  const mutation = useMutation({
    mutationFn: ({ id, handled }: { id: number; handled: boolean }) =>
      adminApi.inquiries.contact.patch(id, { handled }),
    onSuccess: () => {
      toast.success("Updated");
      void qc.invalidateQueries({ queryKey: ["admin", "inquiries", "contact"] });
      void qc.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Update failed"),
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Status</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-muted-foreground">
                No contact inquiries.
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">{row.full_name}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.subject}</TableCell>
                <TableCell className="max-w-[280px] whitespace-pre-wrap text-muted-foreground">
                  {row.message || "—"}
                </TableCell>
                <TableCell>{new Date(row.created_at).toLocaleString()}</TableCell>
                <TableCell>{row.handled ? "Handled" : "Open"}</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={mutation.isPending}
                    onClick={() => mutation.mutate({ id: row.id, handled: !row.handled })}
                  >
                    {row.handled ? "Reopen" : "Mark handled"}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function PartnershipTab() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "inquiries", "partnership"],
    queryFn: () => adminApi.inquiries.partnership.list(),
  });
  const mutation = useMutation({
    mutationFn: ({ id, handled }: { id: number; handled: boolean }) =>
      adminApi.inquiries.partnership.patch(id, { handled }),
    onSuccess: () => {
      toast.success("Updated");
      void qc.invalidateQueries({ queryKey: ["admin", "inquiries", "partnership"] });
      void qc.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Update failed"),
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Status</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-muted-foreground">
                No partnership inquiries.
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">{row.full_name}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.phone}</TableCell>
                <TableCell>{new Date(row.created_at).toLocaleString()}</TableCell>
                <TableCell>{row.handled ? "Handled" : "Open"}</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={mutation.isPending}
                    onClick={() => mutation.mutate({ id: row.id, handled: !row.handled })}
                  >
                    {row.handled ? "Reopen" : "Mark handled"}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function RegistrationTab() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "inquiries", "registration"],
    queryFn: () => adminApi.inquiries.registration.list(),
  });
  const mutation = useMutation({
    mutationFn: ({ id, handled }: { id: number; handled: boolean }) =>
      adminApi.inquiries.registration.patch(id, { handled }),
    onSuccess: () => {
      toast.success("Updated");
      void qc.invalidateQueries({ queryKey: ["admin", "inquiries", "registration"] });
      void qc.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Update failed"),
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Status</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-muted-foreground">
                No registrations.
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">
                  {row.first_name} {row.last_name}
                </TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.position}</TableCell>
                <TableCell>{row.preferred_country}</TableCell>
                <TableCell>{new Date(row.created_at).toLocaleString()}</TableCell>
                <TableCell>{row.handled ? "Handled" : "Open"}</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={mutation.isPending}
                    onClick={() => mutation.mutate({ id: row.id, handled: !row.handled })}
                  >
                    {row.handled ? "Reopen" : "Mark handled"}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
