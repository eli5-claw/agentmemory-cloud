# AgentMemory Cloud

Persistent memory API for AI agents. Store, query, and manage agent memories with vector search capabilities.

## Features

- **Memory Storage API**: RESTful endpoints for CRUD operations
- **Vector Search**: Semantic memory retrieval using Pinecone
- **Multiple Memory Types**: Episodic, Semantic, and Procedural
- **Human Dashboard**: Visual memory browser and management
- **MCP Server**: Model Context Protocol support
- **Authentication**: Clerk-based auth with API keys
- **Payments**: Stripe integration with x402 micropayments

## Tech Stack

- Next.js 14 + TypeScript
- PostgreSQL + Prisma + pgvector
- Pinecone (vector database)
- Redis (caching)
- Clerk (authentication)
- Stripe (payments)

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL with pgvector extension
- Redis
- Pinecone account
- Clerk account
- Stripe account

### Environment Variables

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/agentmemory"

# Redis
REDIS_URL="redis://localhost:6379"

# Pinecone
PINECONE_API_KEY="your-pinecone-api-key"
PINECONE_INDEX="agent-memories"

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# OpenAI (for embeddings)
OPENAI_API_KEY="sk-..."

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### Installation

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Start development server
npm run dev
```

## API Documentation

### Authentication

Use API key in header:
```
Authorization: Bearer amc_live_xxxxxxxxxxxx
X-Agent-ID: agent_123
```

### Endpoints

#### Store Memory
```http
POST /api/v1/memory/store
Content-Type: application/json

{
  "agent_id": "agent_123",
  "memory_type": "semantic",
  "content": "User prefers dark mode",
  "importance": 8,
  "metadata": {
    "tags": ["preference", "ui"]
  }
}
```

#### Query Memories (Vector Search)
```http
POST /api/v1/memory/query
Content-Type: application/json

{
  "agent_id": "agent_123",
  "query": "What does the user prefer?",
  "top_k": 5
}
```

#### List Memories
```http
POST /api/v1/memory/query
Content-Type: application/json

{
  "agent_id": "agent_123",
  "list_only": true,
  "limit": 20
}
```

#### Get Memory
```http
GET /api/v1/memory/{id}
```

#### Update Memory
```http
PATCH /api/v1/memory/{id}
Content-Type: application/json

{
  "content": "Updated content",
  "importance": 9
}
```

#### Delete Memory
```http
DELETE /api/v1/memory/{id}
```

### Agent Management

#### List Agents
```http
GET /api/v1/agents
```

#### Create Agent
```http
POST /api/v1/agents
Content-Type: application/json

{
  "name": "My Agent",
  "description": "Description of the agent"
}
```

### Context Management

#### Get Context
```http
GET /api/v1/context?agent_id={agent_id}&session_id={session_id}
```

#### Update Context
```http
POST /api/v1/context
Content-Type: application/json

{
  "agent_id": "agent_123",
  "session_id": "session_456",
  "context_data": {
    "key": "value"
  }
}
```

#### Add Working Memory
```http
POST /api/v1/context
Content-Type: application/json

{
  "agent_id": "agent_123",
  "session_id": "session_456",
  "working_memory": {
    "content": "Important context",
    "importance": 8
  }
}
```

## Project Structure

```
agentmemory-cloud/
├── prisma/              # Database schema
├── src/
│   ├── app/            # Next.js app router
│   │   ├── api/        # API routes
│   │   ├── dashboard/  # Dashboard pages
│   │   └── ...
│   ├── components/     # React components
│   ├── lib/            # Utilities
│   │   ├── db.ts       # Database client
│   │   ├── pinecone.ts # Vector store
│   │   ├── redis.ts    # Cache client
│   │   ├── memory.ts   # Memory operations
│   │   ├── context.ts  # Context management
│   │   └── auth.ts     # Authentication
│   └── types/          # TypeScript types
├── docker-compose.yml  # Local development
└── README.md
```

## Memory Types

- **Episodic**: Event-based memories (conversations, interactions)
- **Semantic**: Factual knowledge (preferences, facts)
- **Procedural**: How-to knowledge (workflows, processes)
- **Working**: Temporary context for current session

## Development

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Database commands
npm run db:generate   # Generate Prisma client
npm run db:migrate    # Run migrations
npm run db:push       # Push schema changes
npm run db:studio     # Open Prisma Studio
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Docker

```bash
docker-compose up -d
```

## License

MIT
