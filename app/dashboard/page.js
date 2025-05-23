import DashboardForm from '@/components/DashboardForm';
import TimesheetList from '@/components/TimesheetList';

export default function Dashboard() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">Timesheet Management</h1>
      <DashboardForm />
      <TimesheetList />
    </div>
  );
} 