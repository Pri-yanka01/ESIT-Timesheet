import DashboardForm from '@/components/DashboardForm';

export default function Dashboard() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">Timesheet Dashboard</h1>
      <DashboardForm />
    </div>
  );
} 