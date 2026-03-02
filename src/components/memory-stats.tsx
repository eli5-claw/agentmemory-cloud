'use client';

import { useEffect, useState } from 'react';
import { Brain, Users, Zap, Clock } from 'lucide-react';

interface Stats {
  totalMemories: number;
  totalAgents: number;
  recentQueries: number;
  avgResponseTime: string;
}

export function MemoryStats() {
  const [stats, setStats] = useState<Stats>({
    totalMemories: 0,
    totalAgents: 0,
    recentQueries: 0,
    avgResponseTime: '0ms',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch stats from API
    fetch('/api/v1/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats(data.data);
        }
        setLoading(false);
      })
      .catch(() => {
        // Use mock data for now
        setStats({
          totalMemories: 1247,
          totalAgents: 8,
          recentQueries: 342,
          avgResponseTime: '45ms',
        });
        setLoading(false);
      });
  }, []);

  const statCards = [
    {
      name: 'Total Memories',
      value: stats.totalMemories.toLocaleString(),
      icon: Brain,
      color: 'bg-blue-500',
    },
    {
      name: 'Active Agents',
      value: stats.totalAgents.toString(),
      icon: Users,
      color: 'bg-green-500',
    },
    {
      name: 'Recent Queries',
      value: stats.recentQueries.toLocaleString(),
      icon: Zap,
      color: 'bg-yellow-500',
    },
    {
      name: 'Avg Response',
      value: stats.avgResponseTime,
      icon: Clock,
      color: 'bg-purple-500',
    },
  ];

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => (
        <div
          key={stat.name}
          className="bg-white p-6 rounded-lg border shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className={`${stat.color} p-3 rounded-lg`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.name}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
