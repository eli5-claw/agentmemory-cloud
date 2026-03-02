import Link from "next/link";
import { Brain, Zap, Shield, Server, ArrowRight, CheckCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold">AgentMemory</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
              <a href="#api" className="text-gray-600 hover:text-gray-900">API</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-gray-900"
              >
                Dashboard
              </Link>
            </nav>
            <div className="flex items-center gap-4">
              <Link
                href="/sign-in"
                className="hidden sm:block text-gray-600 hover:text-gray-900"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-900">
            Persistent Memory for
            <br />
            <span className="text-blue-600">AI Agents</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Store, query, and manage agent memories with vector search capabilities.
            Build agents that remember and learn from every interaction.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-lg font-medium"
            >
              Start Building Free
              <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href="#api"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border rounded-lg hover:bg-gray-50 text-lg font-medium"
            >
              View Documentation
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">Everything you need</h2>
            <p className="mt-4 text-gray-600">
              Built for developers, designed for scale
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Brain,
                title: 'Vector Search',
                description: 'Semantic memory retrieval using OpenAI embeddings and Pinecone',
              },
              {
                icon: Zap,
                title: 'Fast & Scalable',
                description: 'Redis caching and optimized PostgreSQL for sub-50ms responses',
              },
              {
                icon: Shield,
                title: 'Secure',
                description: 'Clerk authentication with API key management and row-level security',
              },
              {
                icon: Server,
                title: 'RESTful API',
                description: 'Simple HTTP API with comprehensive SDK support coming soon',
              },
            ].map((feature) => (
              <div key={feature.title} className="p-6 rounded-xl border bg-gray-50">
                <feature.icon className="h-10 w-10 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* API Preview */}
      <section id="api" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Simple, powerful API</h2>
              <p className="text-gray-600 mb-8">
                Store and retrieve memories with just a few lines of code.
                Our RESTful API makes it easy to add persistent memory to any agent.
              </p>
              <ul className="space-y-4">
                {[
                  'Store episodic, semantic, and procedural memories',
                  'Vector search for semantic retrieval',
                  'Agent context management',
                  'Importance scoring and metadata',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-900 rounded-xl p-6 overflow-x-auto">
              <pre className="text-sm text-gray-300">
                <code>{`// Store a memory
fetch('/api/v1/memory/store', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer amc_live_xxx',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    agent_id: 'agent_123',
    memory_type: 'semantic',
    content: 'User prefers dark mode',
    importance: 8,
  }),
});

// Query memories
fetch('/api/v1/memory/query', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer amc_live_xxx',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    agent_id: 'agent_123',
    query: 'What are user preferences?',
    top_k: 5,
  }),
});`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">Simple pricing</h2>
            <p className="mt-4 text-gray-600">Start free, scale as you grow</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Free',
                price: '$0',
                description: 'Perfect for prototyping',
                features: [
                  '1,000 memories',
                  '1 agent',
                  '100 queries/month',
                  'Community support',
                ],
              },
              {
                name: 'Pro',
                price: '$29',
                description: 'For growing applications',
                features: [
                  '100,000 memories',
                  '10 agents',
                  '10,000 queries/month',
                  'Priority support',
                  'Advanced analytics',
                ],
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                description: 'For large scale deployments',
                features: [
                  'Unlimited memories',
                  'Unlimited agents',
                  'Unlimited queries',
                  'Dedicated support',
                  'SLA guarantee',
                  'Custom integrations',
                ],
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`p-8 rounded-xl border ${
                  plan.name === 'Pro'
                    ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-20'
                    : ''
                }`}
              >
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.price !== 'Custom' && (
                    <span className="text-gray-500">/month</span>
                  )}
                </div>
                <p className="mt-2 text-gray-600">{plan.description}</p>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`mt-8 w-full py-2 rounded-lg font-medium ${
                    plan.name === 'Pro'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'border hover:bg-gray-50'
                  }`}
                >
                  {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-blue-600" />
              <span className="font-semibold">AgentMemory Cloud</span>
            </div>
            <p className="text-gray-500 text-sm">
              © 2024 AgentMemory Cloud. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
