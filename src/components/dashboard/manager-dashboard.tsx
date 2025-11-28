'use client';

import { useAuth } from '@/app/providers/auth-provider';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useEffect, useState, useMemo } from 'react';
import type { Checklist } from '@/lib/types';
import ChecklistList from '@/components/checklist/checklist-list';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ManagerDashboard() {
  const { user } = useAuth();
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'checklists'),
      orderBy('submittedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const checklistsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Checklist[];
      setChecklists(checklistsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const sortedChecklists = useMemo(() => {
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
    <div className="container py-10">
       <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Safety Manager Dashboard</h1>
          <p className="text-muted-foreground">Monitor overall workplace safety and high-risk activities.</p>
        </div>

      <Card>
        <CardHeader>
          <CardTitle>All Checklists</CardTitle>
          <CardDescription>Prioritized list of all checklists. High-risk items are shown first.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChecklistList checklists={sortedChecklists} loading={loading} isManagerView={true} />
        </CardContent>
      </Card>
    </div>
  );
}
