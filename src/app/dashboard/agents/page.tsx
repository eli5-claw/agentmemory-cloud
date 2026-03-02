import { Metadata } from 'next';
import { DashboardLayout } from '@/components/dashboard-layout';
import { AgentList } from '@/components/agent-list';

export const metadata: Metadata = {
  title: 'Agents | AgentMemory Cloud',
  description: 'Manage your agents',
};

export default function AgentsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agents</h1>
          <p className="text-muted-foreground">
            Manage your AI agents and their API keys
          </p>
        </div>

        <AgentList />
      </div>
    </DashboardLayout>
  );
}
