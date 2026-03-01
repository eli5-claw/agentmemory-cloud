# AgentMemory Cloud - Deployment Guide

## Product Overview
AgentMemory Cloud is a Next.js 14 application with Prisma ORM for database management. It provides cloud-based memory storage for AI agents.

## Tech Stack
- **Framework:** Next.js 14.2.35
- **Language:** TypeScript
- **Database:** PostgreSQL + Prisma + pgvector
- **Cache:** Redis (ioredis)
- **Auth:** Clerk
- **Vector DB:** Pinecone
- **Payments:** Stripe + x402 micropayments
- **AI:** OpenAI (for embeddings)

## Environment Variables

### Required Secrets
```bash
# Database
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"

# Redis
REDIS_URL="redis://default:password@host:port"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_live_..."
CLERK_SECRET_KEY="sk_live_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/dashboard"

# Pinecone Vector Database
PINECONE_API_KEY="..."
PINECONE_ENVIRONMENT="..."
PINECONE_INDEX_NAME="..."

# OpenAI
OPENAI_API_KEY="sk-..."

# Stripe Payments
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PRICE_ID="price_..."
```

## Vercel Configuration

The `vercel.json` is pre-configured with:
- Build command: `prisma generate && next build`
- Node.js 18 runtime
- Proper headers and caching

## Database Setup

### 1. Create PostgreSQL Database
Recommended: Use Vercel Postgres, Supabase, or Railway

### 2. Run Migrations
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push
```

### 3. Verify Connection
Check database connection in Vercel deployment logs.

## Pre-Deployment Checklist

### Vercel Project Setup
- [ ] Create new project on Vercel
- [ ] Link to GitHub repository
- [ ] Set framework preset to Next.js
- [ ] Configure build command: `prisma generate && next build`
- [ ] Set output directory: (leave default)

### Environment Variables
- [ ] Add all required secrets to Vercel Environment Variables
- [ ] Ensure `NODE_ENV=production`
- [ ] Verify all external service credentials are for production

### Database
- [ ] Provision production PostgreSQL database
- [ ] Run initial migrations
- [ ] Verify connection string is correct
- [ ] Set up Redis instance (Upstash recommended)

### External Services
- [ ] Configure Clerk production instance
- [ ] Set up Pinecone index
- [ ] Configure Stripe live mode
- [ ] Verify OpenAI API key has sufficient quota

### Domain Configuration
- [ ] Add custom domain (agentmemory.cloud or similar)
- [ ] Configure DNS records
- [ ] Set up SSL certificate

## Deployment Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for production deployment"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Vercel will auto-deploy on push
   - Monitor build logs for errors

3. **Post-Deployment Verification**
   - [ ] Homepage loads correctly
   - [ ] Sign-up/sign-in works
   - [ ] Database connections successful
   - [ ] API endpoints respond correctly
   - [ ] Stripe checkout functional

## Rollback Plan

If issues occur:
1. Revert to previous commit
2. Redeploy via Vercel dashboard
3. Check error logs in Vercel

## Monitoring

- Vercel Analytics: Built-in
- Error Tracking: Configure Sentry (optional)
- Database: Monitor via provider dashboard

## Support

For deployment issues:
1. Check Vercel deployment logs
2. Verify all environment variables
3. Test database connectivity
4. Review application logs
