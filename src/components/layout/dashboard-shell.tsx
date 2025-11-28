import { ReactNode } from 'react';

interface DashboardShellProps {
  title: string;
  description: string;
  action?: ReactNode;
  children: ReactNode;
}

/**
 * A wrapper layout for dashboard pages.
 * Provides a consistent header with title, description, and optional action (e.g. button).
 * Handles common spacing and animation.
 */
export function DashboardShell({ title, description, action, children }: DashboardShellProps) {
  return (
    <div className="container py-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground text-lg">{description}</p>
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
      <div className="animate-in fade-in-50 duration-500">
        {children}
      </div>
    </div>
  );
}
