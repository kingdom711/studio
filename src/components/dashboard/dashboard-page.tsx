import { useAuth } from '@/providers/auth-provider';
import WorkerDashboard from './worker-dashboard';
import SupervisorDashboard from './supervisor-dashboard';
import ManagerDashboard from './manager-dashboard';

export default function DashboardPage() {
  const { user } = useAuth();

  const renderDashboard = () => {
    switch (user?.role) {
      case 'Worker':
        return <WorkerDashboard />;
      case 'Supervisor':
        return <SupervisorDashboard />;
      case 'SafetyManager':
        return <ManagerDashboard />;
      default:
        return (
          <div className="container py-10">
            <p>Invalid user role. Please contact support.</p>
          </div>
        );
    }
  };

  return <>{renderDashboard()}</>;
}
