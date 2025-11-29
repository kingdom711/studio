import { memo } from 'react';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: string;
  type?: 'status' | 'risk';
}

const STATUS_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  submitted: 'default',
  approved: 'secondary',
  rejected: 'destructive',
  'in-progress': 'outline',
};

const RISK_VARIANTS: Record<string, "default" | "secondary" | "destructive"> = {
  Safe: 'secondary',
  Warning: 'default',
  Danger: 'destructive',
};

/**
 * A unified Badge component for displaying Status or Risk levels.
 * Automatically maps status strings to appropriate visual variants (colors).
 * Memoized to prevent unnecessary re-renders when props haven't changed.
 *
 * @param {string} status - The text to display (e.g. 'submitted', 'Safe')
 * @param {'status' | 'risk'} type - Determines which color mapping to use
 */
export const StatusBadge = memo(function StatusBadge({ status, type = 'status' }: StatusBadgeProps) {
  let variant: "default" | "secondary" | "destructive" | "outline" = 'outline';

  if (type === 'status') {
    variant = STATUS_VARIANTS[status] || 'outline';
  } else {
    variant = RISK_VARIANTS[status] || 'outline';
  }

  return <Badge variant={variant}>{status}</Badge>;
});
