'use client';

import Link from 'next/link';
import { Plus, Search, Key, BookOpen } from 'lucide-react';

const actions = [
  {
    name: 'Store Memory',
    description: 'Add a new memory for an agent',
    href: '/dashboard/memories?action=store',
    icon: Plus,
    color: 'bg-blue-500',
  },
  {
    name: 'Query Memories',
    description: 'Search through agent memories',
    href: '/dashboard/memories?action=query',
    icon: Search,
    color: 'bg-green-500',
  },
  {
    name: 'Create Agent',
    description: 'Add a new agent',
    href: '/dashboard/agents?action=create',
    icon: Key,
    color: 'bg-purple-500',
  },
  {
    name: 'View Docs',
    description: 'API documentation',
    href: '/docs',
    icon: BookOpen,
    color: 'bg-orange-500',
  },
];

export function QuickActions() {
  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold">Quick Actions</h2>
      </div>

      <div className="p-4 grid gap-3">
        {actions.map((action) => (
          <Link
            key={action.name}
            href={action.href}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className={`${action.color} p-2 rounded-lg`}>
              <action.icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{action.name}</p>
              <p className="text-xs text-gray-500">{action.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
