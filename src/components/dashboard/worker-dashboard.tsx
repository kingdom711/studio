'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/app/providers/auth-provider';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useEffect, useState } from 'react';
import type { Checklist } from '@/lib/types';
import ChecklistList from '@/components/checklist/checklist-list';

export default function WorkerDashboard() {
  const { user } = useAuth();
  const db = useFirestore();

  const checklistsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(
      collection(db, 'checklists'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
  }, [db, user]);

  const { data: checklists, loading } = useCollection<Checklist>(checklistsQuery);

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Dashboard</h1>
          <p className="text-muted-foreground">Welcome, {user?.name}. Start a new safety check or review your history.</p>
        </div>
        <Button asChild size="lg">
          <Link href="/checklists/new">
            <PlusCircle className="mr-2 h-5 w-5" />
            New Checklist
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Checklist History</CardTitle>
          <CardDescription>A log of all your submitted safety checklists.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChecklistList checklists={checklists || []} loading={loading} />
        </CardContent>
      </Card>
    </div>
  );
}
