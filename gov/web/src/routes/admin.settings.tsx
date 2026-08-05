import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCms } from "@/lib/cms-store";
import type { Settings } from "@/data/cms-seed";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({
    meta: [
      { title: "Settings — DoFE Admin Panel" },
      { name: "description", content: "Manage site identity, contact details and demo admin credentials." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: SettingsPage,
});

const FIELDS: { name: keyof Settings; label: string }[] = [
  { name: "siteName", label: "Department name" },
  { name: "ministry", label: "Ministry" },
  { name: "address", label: "Address" },
  { name: "phone", label: "Phone" },
  { name: "tollFree", label: "Toll free number" },
  { name: "email", label: "Email" },
  { name: "adminUser", label: "Admin username" },
  { name: "adminPassword", label: "Admin password" },
];

function SettingsPage() {
  const { data, updateSettings } = useCms();
  const [form, setForm] = useState<Settings>(data.settings);

  return (
    <div>
      <h1 className="text-2xl font-semibold">Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Site identity, contact details and demo login credentials.
      </p>

      <form
        className="mt-6 max-w-3xl rounded-lg border border-border bg-card p-6"
        onSubmit={(e) => {
          e.preventDefault();
          updateSettings(form);
          toast.success("Settings saved");
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {FIELDS.map((f) => (
            <div key={f.name}>
              <Label htmlFor={f.name}>{f.label}</Label>
              <Input
                id={f.name}
                className="mt-1.5"
                value={form[f.name]}
                onChange={(e) => setForm((s) => ({ ...s, [f.name]: e.target.value }))}
              />
            </div>
          ))}
        </div>
        <div className="mt-6 flex gap-2">
          <Button type="submit">Save changes</Button>
          <Button type="button" variant="outline" onClick={() => setForm(data.settings)}>
            Reset form
          </Button>
        </div>
      </form>
    </div>
  );
}
