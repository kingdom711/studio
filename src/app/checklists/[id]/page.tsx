'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Checklist, ChecklistTemplate } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import ChecklistForm from '@/components/checklist/checklist-form';
import ChecklistView from '@/components/checklist/checklist-view';

export default function ChecklistPage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const id = params.id as string;
  const isNew = searchParams.get('new') === 'true';

  const [data, setData] = useState<Checklist | ChecklistTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const collectionName = isNew ? 'checklist_templates' : 'checklists';
        const docRef = doc(db, collectionName, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setData({ id: docSnap.id, ...docSnap.data() } as Checklist | ChecklistTemplate);
        } else {
          setError('Document not found.');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch document.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isNew]);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-10 text-center text-destructive">
        <p>{error}</p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="container py-10">
      {isNew ? (
        <ChecklistForm template={data as ChecklistTemplate} />
      ) : (
        <ChecklistView checklist={data as Checklist} />
      )}
    </div>
  );
}
