'use client';

import { useAuth } from '@/app/providers/auth-provider';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useEffect, useState } from 'react';
import type { Checklist } from '@/lib/types';
import ChecklistList from '@/components/checklist/checklist-list';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SupervisorDashboard() {
  const { user } = useAuth();
  const db = useFirestore();
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'checklists'),
      where('status', '==', 'submitted'),
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
  }, [user, db]);
  
  return (
    <div className="container py-10">
       <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Supervisor Dashboard</h1>
          <p className="text-muted-foreground">Review and approve submitted checklists.</p>
        </div>

      <Card>
        <CardHeader>
          <CardTitle>Checklists for Review</CardTitle>
          <CardDescription>These checklists are waiting for your approval.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChecklistList checklists={checklists} loading={loading} />
        </CardContent>
      </Card>
    </div>
  );
}
