'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatDateTime, getMemoryTypeColor, truncate } from '@/lib/utils';
import { Brain, ArrowRight } from 'lucide-react';

interface Memory {
  id: string;
  agent_id: string;
  memory_type: string;
  content: string;
  importance: number;
  created_at: string;
}

export function RecentMemories() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch recent memories
    fetch('/api/v1/memory/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agent_id: 'all',
        list_only: true,
        limit: 5,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMemories(data.data.memories);
        }
        setLoading(false);
      })
      .catch(() => {
        // Mock data
        setMemories([
          {
            id: '1',
            agent_id: 'agent_1',
            memory_type: 'semantic',
            content: 'User prefers dark mode interface and compact layout',
            importance: 8,
            created_at: new Date().toISOString(),
          },
          {
            id: '2',
            agent_id: 'agent_1',
            memory_type: 'episodic',
            content: 'User completed onboarding successfully and was satisfied',
            importance: 6,
            created_at: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: '3',
            agent_id: 'agent_2',
            memory_type: 'procedural',
            content: 'Optimal workflow: analyze → summarize → present',
            importance: 9,
            created_at: new Date(Date.now() - 7200000).toISOString(),
          },
        ]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Memories</h2>
          <Link
            href="/dashboard/memories"
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="divide-y">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="p-4 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          ))
        ) : memories.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Brain className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No memories yet</p>
            <p className="text-sm">Start storing memories to see them here</p>
          </div>
        ) : (
          memories.map((memory) => (
            <div key={memory.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    {truncate(memory.content, 100)}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getMemoryTypeColor(
                        memory.memory_type
                      )}`}
                    >
                      {memory.memory_type}
                    </span>
                    <span className="text-xs text-gray-500">
                      Importance: {memory.importance}/10
                    </span>
                  </div>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {formatDateTime(memory.created_at)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
