'use client';

import { useEffect, useState } from 'react';
import { formatDate } from '@/lib/utils';
import { Users, Key, Plus, Copy, Check } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  description: string | null;
  api_key: string;
  memory_count: number;
  created_at: string;
}

export function AgentList() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentDescription, setNewAgentDescription] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const res = await fetch('/api/v1/agents');
      const data = await res.json();
      if (data.success) {
        setAgents(data.data.agents);
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
      // Mock data
      setAgents([
        {
          id: '1',
          name: 'Customer Support Bot',
          description: 'Handles customer inquiries',
          api_key: 'amc_agent_abc123xyz789',
          memory_count: 342,
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Research Assistant',
          description: 'Helps with research tasks',
          api_key: 'amc_agent_def456uvw012',
          memory_count: 128,
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newAgentName,
          description: newAgentDescription,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAgents([data.data, ...agents]);
        setShowCreateForm(false);
        setNewAgentName('');
        setNewAgentDescription('');
      }
    } catch (error) {
      console.error('Error creating agent:', error);
    }
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Your Agents ({agents.length})</h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Create Agent
        </button>
      </div>

      {showCreateForm && (
        <form
          onSubmit={handleCreateAgent}
          className="bg-white p-6 rounded-lg border shadow-sm space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={newAgentName}
              onChange={(e) => setNewAgentName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Customer Support Bot"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={newAgentDescription}
              onChange={(e) => setNewAgentDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="What does this agent do?"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-4">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="bg-white p-6 rounded-lg border shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{agent.name}</h3>
                  {agent.description && (
                    <p className="text-sm text-gray-500">{agent.description}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    Created {formatDate(agent.created_at)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{agent.memory_count}</p>
                <p className="text-sm text-gray-500">memories</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-500">API Key:</span>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                  {agent.api_key.slice(0, 20)}...
                </code>
                <button
                  onClick={() => handleCopyKey(agent.api_key)}
                  className="p-1 hover:bg-gray-100 rounded"
                  title="Copy API key"
                >
                  {copiedKey === agent.api_key ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
