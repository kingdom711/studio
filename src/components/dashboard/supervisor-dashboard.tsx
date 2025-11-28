import ChecklistList from '@/components/checklist/checklist-list';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { useChecklistQuery } from '@/hooks/use-checklist-query';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export default function SupervisorDashboard() {
  const { data: checklists, loading, refresh } = useChecklistQuery('Supervisor');
  
  return (
    <DashboardShell
      title="Supervisor Dashboard"
      description="Review and approve submitted checklists."
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Checklists for Review</CardTitle>
            <CardDescription>These checklists are waiting for your approval.</CardDescription>
          </div>
          <Button variant="outline" size="icon" onClick={refresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </CardHeader>
        <CardContent>
          <ChecklistList checklists={checklists || []} loading={loading} isManagerView={true}/>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
