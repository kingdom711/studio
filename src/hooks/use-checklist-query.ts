import { collection, query, where, orderBy } from 'firebase/firestore';
import { useAuth } from '@/providers/auth-provider';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import type { Checklist } from '@/lib/types';

/**
 * A hook to fetch checklists based on the user's role.
 * 
 * - **Worker**: Fetches checklists created by the current user.
 * - **Supervisor**: Fetches only 'submitted' checklists pending review.
 * - **Manager**: Fetches ALL checklists sorted by submission date.
 * 
 * Uses `useMemoFirebase` to ensure the query reference remains stable, preventing infinite loops.
 * 
 * @param role - The dashboard role context.
 * @returns Object containing `data` (Checklist[]), `loading` (boolean), `error`, and `refresh` function.
 */
export function useChecklistQuery(role: 'Worker' | 'Supervisor' | 'Manager') {
  const { user } = useAuth();
  const db = useFirestore();

  const queryConstraints = useMemoFirebase(() => {
    if (!user) return null;
    const base = collection(db, 'checklists');

    if (role === 'Worker') {
       return query(base, where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
    }
    if (role === 'Supervisor') {
       return query(base, where('status', '==', 'submitted'), orderBy('submittedAt', 'desc'));
    }
    // Manager
    return query(base, orderBy('submittedAt', 'desc')); 
  }, [db, user, role]);

  const { data, isLoading, error, refresh } = useCollection<Checklist>(queryConstraints);

  return { data, loading: isLoading, error, refresh };
}
