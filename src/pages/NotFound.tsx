import { Link } from "react-router-dom";
import { AppLayout } from "../components/AppLayout";
import { Button } from "../components/ui/button";

export default function NotFound() {
  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
        <h1 className="text-4xl font-bold font-mono text-primary">404</h1>
        <p className="text-sm text-muted-foreground">The telemetry view or page you requested does not exist.</p>
        <Button asChild size="sm">
          <Link to="/dashboard">Return to Live Dashboard</Link>
        </Button>
      </div>
    </AppLayout>
  );
}
