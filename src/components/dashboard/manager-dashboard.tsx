import { useMemo } from 'react';
import ChecklistList from '@/components/checklist/checklist-list';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { useChecklistQuery } from '@/hooks/use-checklist-query';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export default function ManagerDashboard() {
  const { data: checklists, loading, refresh } = useChecklistQuery('Manager');

  const sortedChecklists = useMemo(() => {
    if (!checklists) return [];
    return [...checklists].sort((a, b) => {
      const aHasPriority = a.hasRisks || a.riskLevel === 'Danger';
      const bHasPriority = b.hasRisks || b.riskLevel === 'Danger';
      if (aHasPriority && !bHasPriority) return -1;
      if (!aHasPriority && bHasPriority) return 1;
      // If both or neither have priority, sort by date
      if (a.submittedAt && b.submittedAt) {
        return b.submittedAt.toMillis() - a.submittedAt.toMillis();
      }
      return 0;
    });
  }, [checklists]);
  
  return (
    <DashboardShell
      title="Safety Manager Dashboard"
      description="Monitor overall workplace safety and high-risk activities."
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>All Checklists</CardTitle>
            <CardDescription>Prioritized list of all checklists. High-risk items are shown first.</CardDescription>
          </div>
          <Button variant="outline" size="icon" onClick={refresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </CardHeader>
        <CardContent>
          <ChecklistList checklists={sortedChecklists} loading={loading} isManagerView={true} />
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
