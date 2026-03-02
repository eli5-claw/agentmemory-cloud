'use client';

import { useEffect, useState } from 'react';
import { formatDateTime, getMemoryTypeColor } from '@/lib/utils';
import { Search, Brain, X } from 'lucide-react';

interface Memory {
  id: string;
  agent_id: string;
  memory_type: string;
  content: string;
  importance: number;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  access_count: number;
}

interface Agent {
  id: string;
  name: string;
}

export function MemoryBrowser() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const memoryTypes = ['episodic', 'semantic', 'procedural', 'working'];

  useEffect(() => {
    fetchAgents();
    fetchMemories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      setAgents([
        { id: 'agent_1', name: 'Customer Support Bot' },
        { id: 'agent_2', name: 'Research Assistant' },
      ]);
    }
  };

  const fetchMemories = async () => {
    try {
      const res = await fetch('/api/v1/memory/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent_id: selectedAgent || 'all',
          list_only: true,
          limit: 50,
          memory_type: selectedType || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMemories(data.data.memories);
      }
    } catch (error) {
      console.error('Error fetching memories:', error);
      // Mock data
      setMemories([
        {
          id: '1',
          agent_id: 'agent_1',
          memory_type: 'semantic',
          content: 'User prefers dark mode interface',
          importance: 8,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          access_count: 12,
        },
        {
          id: '2',
          agent_id: 'agent_1',
          memory_type: 'episodic',
          content: 'User completed onboarding successfully',
          importance: 6,
          created_at: new Date(Date.now() - 3600000).toISOString(),
          updated_at: new Date(Date.now() - 3600000).toISOString(),
          access_count: 3,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const res = await fetch('/api/v1/memory/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent_id: selectedAgent || 'all',
          query: searchQuery,
          top_k: 10,
          memory_type: selectedType || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMemories(data.data.results.map((r: { memory: Memory }) => r.memory));
      }
    } catch (error) {
      console.error('Error searching memories:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedAgent('');
    setSelectedType('');
    fetchMemories();
  };

  const hasFilters = searchQuery || selectedAgent || selectedType;

  return (
    <div className="space-y-6">
      {/* Search and filters */}
      <div className="bg-white p-4 rounded-lg border shadow-sm space-y-4">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search memories..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching || !searchQuery.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </form>

        <div className="flex flex-wrap gap-3">
          <select
            value={selectedAgent}
            onChange={(e) => {
              setSelectedAgent(e.target.value);
              fetchMemories();
            }}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Agents</option>
            {agents.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.name}
              </option>
            ))}
          </select>

          <select
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value);
              fetchMemories();
            }}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            {memoryTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <X className="h-4 w-4" />
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-semibold">Memories ({memories.length})</h3>
        </div>

        <div className="divide-y">
          {loading ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="p-4 animate-pulse">
                <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            ))
          ) : memories.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <Brain className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No memories found</p>
              {hasFilters && (
                <p className="text-sm mt-1">Try adjusting your filters</p>
              )}
            </div>
          ) : (
            memories.map((memory) => (
              <div key={memory.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">
                      {memory.content}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-3">
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
                      <span className="text-xs text-gray-400">
                        Accessed {memory.access_count} times
                      </span>
                      {memory.metadata && Object.keys(memory.metadata).length > 0 && (
                        <span className="text-xs text-gray-400">
                          Metadata: {Object.keys(memory.metadata).join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-xs text-gray-400 whitespace-nowrap">
                    <p>Created: {formatDateTime(memory.created_at)}</p>
                    <p>Updated: {formatDateTime(memory.updated_at)}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
