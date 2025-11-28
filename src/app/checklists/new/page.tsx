'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { ChecklistTemplate } from '@/lib/types';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, HardHat, Ladder, Wind } from 'lucide-react';

const workTypeIcons: { [key: string]: React.ReactNode } = {
    '사다리 작업': <Ladder className="h-8 w-8 text-primary" />,
    '고소작업대 작업': <HardHat className="h-8 w-8 text-primary" />,
    '밀폐공간 작업': <Wind className="h-8 w-8 text-primary" />,
}

export default function NewChecklistPage() {
  const [templates, setTemplates] = useState<ChecklistTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const q = query(collection(db, 'checklist_templates'));
        const querySnapshot = await getDocs(q);
        const templatesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as ChecklistTemplate[];
        setTemplates(templatesData);
      } catch (error) {
        console.error("Error fetching templates: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  return (
    <div className="container py-10">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
            <h1 className="text-3xl font-bold tracking-tight">Start a New Safety Checklist</h1>
            <p className="text-muted-foreground mt-2">Select the type of work you will be performing.</p>
        </div>

        <div className="grid gap-4">
          {loading ? (
            <>
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-28 w-full" />
            </>
          ) : (
            templates.map(template => (
              <Link key={template.id} href={`/checklists/${template.id}?new=true`} legacyBehavior>
                <a className="block">
                    <Card className="hover:border-primary hover:shadow-lg transition-all">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="flex items-center gap-4">
                                {workTypeIcons[template.workType] || <HardHat className="h-8 w-8 text-primary" />}
                                <div>
                                    <CardTitle>{template.workType}</CardTitle>
                                    <CardDescription>Version {template.version}</CardDescription>
                                </div>
                            </div>
                            <ArrowRight className="h-5 w-5 text-muted-foreground" />
                        </CardHeader>
                    </Card>
                </a>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
