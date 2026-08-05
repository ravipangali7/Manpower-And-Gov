import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/admin/registrations")({
  ssr: false,
  component: AdminRegistrationsPage,
});

function AdminRegistrationsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Online Registration</h1>
        <p className="text-sm text-muted-foreground">
          Candidate registrations submitted via /online-registration are reviewed in Inquiries.
          The public form is always live; no extra page content is required.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Registration submissions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            View, filter and mark registration applications as handled from the Inquiries panel.
            CV uploads are stored with each submission.
          </p>
          <Button asChild>
            <Link to="/admin/inquiries" search={{ tab: "registration" }}>
              Open registration inquiries
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
