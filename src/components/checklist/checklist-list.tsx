import type { Checklist } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '../ui/skeleton';
import { AlertTriangle, ShieldCheck } from 'lucide-react';
import { StatusBadge } from '@/components/shared/status-badge';
import { formatDate } from '@/lib/utils';

/**
 * Props for the ChecklistList component
 * @property {Checklist[]} checklists - The list of checklist data to display
 * @property {boolean} loading - Whether the data is currently loading
 * @property {boolean} isManagerView - Optional flag to toggle manager-specific columns (e.g. worker name)
 */
interface ChecklistListProps {
  checklists: Checklist[];
  loading: boolean;
  isManagerView?: boolean;
}

/**
 * Displays a list of checklists in a tabular format.
 * Handles loading states, empty states, and role-based column visibility.
 */
export default function ChecklistList({ checklists, loading, isManagerView = false }: ChecklistListProps) {
  const navigate = useNavigate();

  // Display skeleton loaders while data is fetching
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  // Display empty state if no checklists exist
  if (checklists.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border rounded-lg bg-muted/10 border-dashed">
        <ShieldCheck className="h-10 w-10 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No checklists found</h3>
        <p className="text-muted-foreground max-w-sm mt-2">
          There are no safety checklists submitted yet.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border shadow-sm bg-card overflow-hidden">
        <Table>
            <TableHeader className="bg-muted/50">
                <TableRow>
                <TableHead className='w-[120px]'>Risk Level</TableHead>
                <TableHead className="font-semibold">Work Type</TableHead>
                {/* Conditionally render Worker column for Managers/Supervisors */}
                {isManagerView && <TableHead className="font-semibold">Worker</TableHead>}
                <TableHead className="font-semibold">Date Submitted</TableHead>
                <TableHead className="text-right font-semibold">Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {checklists.map((checklist) => (
                <TableRow 
                    key={checklist.id} 
                    onClick={() => navigate(`/checklists/${checklist.id}`)} 
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                >
                    {/* Risk Level Indicator */}
                    <TableCell>
                        <div className='flex items-center gap-3'>
                        {checklist.hasRisks || checklist.riskLevel === 'Danger' ? (
                            <div className="p-2 bg-destructive/10 rounded-full">
                                <AlertTriangle className="h-4 w-4 text-destructive" />
                            </div>
                        ) : (
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                                <ShieldCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                            </div>
                        )}
                        {checklist.riskLevel && (
                             <StatusBadge status={checklist.riskLevel} type="risk" />
                        )}
                        </div>
                    </TableCell>
                    <TableCell>
                        <span className="font-medium text-base">{checklist.workType}</span>
                    </TableCell>
                    {/* Worker Info (Only for Manager View) */}
                    {isManagerView && (
                        <TableCell>
                            <div className="flex items-center gap-2">
                                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                                    {checklist.userName.charAt(0)}
                                </div>
                                <span>{checklist.userName}</span>
                            </div>
                        </TableCell>
                    )}
                    <TableCell className="text-muted-foreground">
                    {formatDate(checklist.submittedAt)}
                    </TableCell>
                    <TableCell className="text-right">
                        <StatusBadge status={checklist.status} type="status" />
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>
  );
}
