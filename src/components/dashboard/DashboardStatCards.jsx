import { CalendarDays, CheckCircle2, Clock3, Users } from 'lucide-react';
import StatCard from '../ui/StatCard.jsx';

export default function DashboardStatCards({ toApproveCount, inProgressCount, scheduledWeekCount, activeClientsCount }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard to="/admin/contenuti" icon={CheckCircle2} label="Contenuti da approvare" value={toApproveCount} tone="amber" />
      <StatCard to="/admin/board" icon={Clock3} label="In lavorazione" value={inProgressCount} />
      <StatCard to="/admin/calendario" icon={CalendarDays} label="Programmato questa settimana" value={scheduledWeekCount} tone="mint" />
      <StatCard to="/admin/clienti" icon={Users} label="Clienti attivi" value={activeClientsCount} tone="coral" />
    </div>
  );
}
