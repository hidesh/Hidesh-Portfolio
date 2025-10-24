# Security Policy

## 🔒 Sikkerhedspolitik

Dette projekt tager sikkerhed seriøst. Vi har implementeret flere lag af sikkerhed for at beskytte både koden og brugerdata.

## 🛡️ Sikkerhedsforanstaltninger

### Environment Variables
- ✅ Alle følsomme data er i `.env.local` (ikke committed til git)
- ✅ Placeholder values i `.env.example`
- ✅ Automated validation af environment variables
- ✅ Production secrets håndteret gennem Vercel/GitHub Secrets

### Code Security
- ✅ Automatiske security scans i CI/CD pipeline
- ✅ Dependency vulnerability checks
- ✅ Secret detection i commits
- ✅ Input validation med Zod
- ✅ TypeScript for type safety

### Data Protection
- ✅ Supabase RLS (Row Level Security)
- ✅ API rate limiting
- ✅ CORS konfiguration
- ✅ Secure headers

## 🚨 Rapporter Sikkerhedsproblemer

Hvis du finder et sikkerhedsproblem:

### Gør IKKE:
- ❌ Opret ikke et public GitHub issue
- ❌ Del ikke problemet offentligt
- ❌ Test ikke på production

### Gør i stedet:
1. 📧 Send en email til: security@hidesh.com
2. 🔍 Beskriv problemet detaljeret
3. 📋 Inkluder steps to reproduce
4. ⏳ Vent på respons (målsætning: 48 timer)

## 🏆 Security Rewards

Vi værdsætter ansvarlig disclosure:
- 🎯 Credit i SECURITY.md for valid rapporter
- 🎉 Potential bounty for kritiske fund
- 📜 Hall of Fame anerkendelse

## 📋 Supporterede Versioner

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | ✅ Yes             |
| < 1.0   | ❌ No              |

## 🔧 Sikkerhedstjek

Kør disse kommandoer for at tjekke sikkerhed:

```bash
# Environment validation
pnpm validate-env

# Security audit
pnpm security:scan

# Dependency check
pnpm audit

# Full security suite
pnpm pre-deploy
```

## 📚 Sikkerhedsressourcer

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [Supabase Security](https://supabase.com/docs/guides/auth/row-level-security)

---

**Sidste opdatering**: 22. oktober 2025  
**Security Contact**: security@hidesh.com