# 🚀 Deployment Guide

## 📋 Før Du Starter

### 1. Environment Variables
Kopier `.env.local.example` til `.env.local` og udfyld med rigtige værdier:

```bash
cp .env.local.example .env.local
```

Rediger `.env.local` og tilføj:
- ✅ Supabase URL og Anon Key
- ✅ Microsoft Clarity Project ID  
- ✅ Contact email
- ✅ Andre nødvendige secrets

### 2. Sikkerhedstjek
Kør disse kommandoer før deployment:

```bash
# Valider environment variables
pnpm validate-env

# Security audit  
pnpm security:scan

# Full pre-deployment check
pnpm pre-deploy
```

## 🔐 GitHub Secrets Setup

Gå til dit GitHub repository → Settings → Secrets and Variables → Actions

### Required Secrets:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
NEXT_PUBLIC_CLARITY_PROJECT_ID=your_clarity_id
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
```

### Optional Secrets:
```bash
CODECOV_TOKEN=your_codecov_token
CONTACT_EMAIL=your_email@domain.com
```

## 🌐 Vercel Deployment