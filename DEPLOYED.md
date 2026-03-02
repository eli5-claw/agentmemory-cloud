# Deployment Guide

## Deployed Services

### Production URLs
- **Web App**: https://agentmemory-cloud.vercel.app
- **API**: https://agentmemory-cloud.vercel.app/api/v1

### Required Environment Variables

```bash
# Database (PostgreSQL with pgvector)
DATABASE_URL="postgresql://..."

# Redis (Upstash or similar)
REDIS_URL="rediss://..."

# Pinecone
PINECONE_API_KEY="..."
PINECONE_INDEX="agent-memories"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_live_..."
CLERK_SECRET_KEY="sk_live_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# OpenAI (for embeddings)
OPENAI_API_KEY="sk-..."

# Stripe (optional, for payments)
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

## Deployment Steps

### 1. Database Setup

Create a PostgreSQL database with pgvector extension:

```sql
CREATE DATABASE agentmemory;
\c agentmemory
CREATE EXTENSION IF NOT EXISTS vector;
```

### 2. Pinecone Setup

1. Create a Pinecone account at https://pinecone.io
2. Create an index named "agent-memories"
3. Set dimension to 1536 (for OpenAI embeddings)
4. Copy the API key

### 3. Clerk Setup

1. Create a Clerk account at https://clerk.dev
2. Create a new application
3. Copy the publishable and secret keys
4. Configure sign-in and sign-up URLs

### 4. Vercel Deployment

1. Push code to GitHub
2. Import repository in Vercel
3. Add all environment variables
4. Deploy

### 5. Post-Deployment

Run database migrations:
```bash
npx prisma migrate deploy
```

## API Endpoints

All endpoints are live at:
- `https://agentmemory-cloud.vercel.app/api/v1/memory/store`
- `https://agentmemory-cloud.vercel.app/api/v1/memory/query`
- `https://agentmemory-cloud.vercel.app/api/v1/agents`
- `https://agentmemory-cloud.vercel.app/api/v1/context`

## Monitoring

- Vercel Analytics: Enabled
- Error Tracking: Via Vercel
- Database: Via provider dashboard
