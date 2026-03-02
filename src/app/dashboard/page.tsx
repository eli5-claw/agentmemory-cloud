import { Metadata } from 'next';
import { DashboardLayout } from '@/components/dashboard-layout';
import { MemoryStats } from '@/components/memory-stats';
import { RecentMemories } from '@/components/recent-memories';
import { QuickActions } from '@/components/quick-actions';

export const metadata: Metadata = {
  title: 'Dashboard | AgentMemory Cloud',
  description: 'Manage your agent memories',
};

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your agents and their memories
          </p>
        </div>

        <MemoryStats />

        <div className="grid gap-8 md:grid-cols-2">
          <RecentMemories />
          <QuickActions />
        </div>
      </div>
    </DashboardLayout>
  );
}
