import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/providers/auth-provider';
import ChecklistList from '@/components/checklist/checklist-list';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { useChecklistQuery } from '@/hooks/use-checklist-query';

export default function WorkerDashboard() {
  const { user } = useAuth();
  const { data: checklists, loading, refresh } = useChecklistQuery('Worker');

  return (
    <DashboardShell
      title="My Dashboard"
      description={`Welcome, ${user?.name}. Start a new safety check or review your history.`}
      action={
        <Button asChild size="lg">
          <Link to="/checklists/new">
            <PlusCircle className="mr-2 h-5 w-5" />
            New Checklist
          </Link>
        </Button>
      }
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>My Checklist History</CardTitle>
            <CardDescription>A log of all your submitted safety checklists.</CardDescription>
          </div>
          <Button variant="outline" size="icon" onClick={refresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </CardHeader>
        <CardContent>
          <ChecklistList checklists={checklists || []} loading={loading} />
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
