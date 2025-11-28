'use client';
import type { Checklist } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { Skeleton } from '../ui/skeleton';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

interface ChecklistListProps {
  checklists: Checklist[];
  loading: boolean;
  isManagerView?: boolean;
}

const statusVariantMap: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
  submitted: 'default',
  approved: 'secondary',
  rejected: 'destructive',
  'in-progress': 'outline',
};

const riskLevelVariantMap: { [key: string]: 'default' | 'secondary' | 'destructive' } = {
    Safe: 'secondary',
    Warning: 'default',
    Danger: 'destructive',
}

export default function ChecklistList({ checklists, loading, isManagerView = false }: ChecklistListProps) {
  const router = useRouter();

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (checklists.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <p>No checklists found.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
        <Table>
            <TableHeader>
                <TableRow>
                <TableHead className='w-[100px]'>Risk</TableHead>
                <TableHead>Work Type</TableHead>
                {isManagerView && <TableHead>Worker</TableHead>}
                <TableHead>Date Submitted</TableHead>
                <TableHead className="text-right">Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {checklists.map((checklist) => (
                <TableRow key={checklist.id} onClick={() => router.push(`/checklists/${checklist.id}`)} className="cursor-pointer">
                    <TableCell>
                        <div className='flex items-center gap-2'>
                        {checklist.hasRisks || checklist.riskLevel === 'Danger' ? <AlertTriangle className="h-5 w-5 text-accent" /> : <ShieldCheck className="h-5 w-5 text-green-600" />}
                        {checklist.riskLevel && (
                             <Badge variant={riskLevelVariantMap[checklist.riskLevel] || 'outline'}>{checklist.riskLevel}</Badge>
                        )}
                        </div>
                    </TableCell>
                    <TableCell className="font-medium">{checklist.workType}</TableCell>
                    {isManagerView && <TableCell>{checklist.userName}</TableCell>}
                    <TableCell>
                    {checklist.submittedAt ? format(checklist.submittedAt.toDate(), 'PPP') : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                        <Badge variant={statusVariantMap[checklist.status] || 'outline'}>
                            {checklist.status}
                        </Badge>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>
  );
}
