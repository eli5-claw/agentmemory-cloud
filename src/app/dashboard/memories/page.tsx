import { Metadata } from 'next';
import { DashboardLayout } from '@/components/dashboard-layout';
import { MemoryBrowser } from '@/components/memory-browser';

export const metadata: Metadata = {
  title: 'Memories | AgentMemory Cloud',
  description: 'Browse and search agent memories',
};

export default function MemoriesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Memories</h1>
          <p className="text-muted-foreground">
            Browse, search, and manage agent memories
          </p>
        </div>

        <MemoryBrowser />
      </div>
    </DashboardLayout>
  );
}
