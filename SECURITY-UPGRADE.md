# Portfolio-opdatering — 9. september 2026

Forsiden har fået nyt layout, tydeligere projektpræsentationer, kortere tekst, mobilnavigation og en interaktiv Three.js-skulptur. Den har pauseknap, reduceret pixelratio, oprydning af GPU-ressourcer, pause uden for viewport og statisk fallback ved reduceret bevægelse eller manglende WebGL. Projektillustrationerne er mærket som koncepter; de er ikke screenshots af de eksterne apps.

## Sikkerhedsrettelser

- Samlet Next.js på 16.3.4 og React på 19.3.0; opdateret direkte og indirekte dependencies. pnpm 8.15.4 er den eneste package manager, og pnpm-lock.yaml er den autoritative lockfil. Den gamle npm-lockfil og ubrugte Next.js-installation i lint-pakken er fjernet.
- Rettet Supabase-skemaets manglende Relationships-typer, årsagen til `body_mdx` på `never`. Rettet bloggens nullable typer og sitemapets forkerte tabelnavn.
- Media, uploads, posts og Clarity kræver verificeret bruger med serverstyret `app_metadata.role = admin`. Skrivekald kræver samme Origin. CMS har også serverkontrol; bot-user-agent og dummyAuth-cookie kan ikke give adgang. Login-redirects er begrænset til CMS.
- CAPTCHA har ingen standardhemmelighed, udløber efter fem minutter og kontrollerer signatur, algoritme og heltalsgrænser. En databasefunktion forhindrer genbrug på tværs af serverless-instanser og begrænser samme afsender til tre beskeder på 15 minutter samt fem pr. IP på 15 minutter og 20 pr. IP på 24 timer. Identiske beskeder afvises i 24 timer, og en skjult spamfælde afviser simpel automatisk formularudfyldning. IP-adresser behandles som nøglebeskyttede hashes; IPv6-adresser grupperes pr. /64. På Vercel bruges kun platformens x-vercel-forwarded-for-header; uden for Vercel bruges en fælles konservativ grænse, indtil en betroet reverse proxy er konfigureret.
- Kontaktfelter og blogindhold valideres; kontakt- og blog-JSON læses med reel bytegrænse. E-mail-HTML escapes. Uploads får typebestemt filendelse og signaturkontrol. Billeder slettes ikke efter en fejlet post-opdatering under omdøbning.
- Nye restriktive databasepolitikker begrænser gamle permissive regler. Direkte anonym skrivning til databasen lukkes, herunder gamle pageview/event-skrivninger; Clarity og den serverbaserede kontaktformular er de bevarede indsamlingsveje. Fremtidige og upublicerede posts skjules i offentlige queries.
- Tilføjet CSP for base-URI, indlejring, objekter og formularer; SVG-optimering er slået fra. Dette er ikke en fuld script-CSP.

## Nødvendigt før deployment

Der er ikke adgang til din live-Supabase/Vercel-konfiguration i denne opgave. Følgende er derfor **ikke udført live**:

1. Brug Node.js 22 eller 24 og pnpm 8.15.4. Kør `pnpm install --frozen-lockfile`.
2. Sæt din rigtige Supabase-administratorbrugers **app_metadata** til at indeholde `"role": "admin"` via en betroet Supabase-administrator. Brug ikke user_metadata eller profiles.role. Log ind igen, så sessionen afspejler rollen. Bekræft også, at brugerens auth-id har en tilsvarende profiles-række, da posts.author_id refererer til profiles.
3. Kør først `supabase/migrations/20260909210000_harden_portfolio_access.sql` og derefter `supabase/migrations/20260909220000_contact_spam_protection.sql` på den eksisterende database. Den forudsætter eksisterende `published_at`-kolonner, som applikationen allerede bruger. Test migration og admin-adgang i staging først. Gamle migrationer har modstridende skemaer og bør ikke genafspilles blindt på en ny database.
4. Sæt NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY, CONTACT_EMAIL og ALTCHA_HMAC_KEY. Lokalt placeres værdier i apps/web/.env.local; på Vercel i projektets miljøvariabler. ALTCHA_HMAC_KEY skal være en unik tilfældig hemmelighed på mindst 32 tegn. Generér f.eks. med `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`.
5. Sæt eventuelle Clarity-variabler. Kontroller en rigtig admin-session, upload/omdøbning, blogredigering og kontaktbesked i staging. En kontaktformular uden migration/konfiguration afviser sikkert og viser en alternativ e-mailadresse.
6. Deploy ændringerne. GitHubs Dependabot-advarsler lukkes først efter opdateringen er på den overvågede branch og GitHub har scannet den.

## Verifikation

- pnpm audit: **0 kendte sårbarheder**, 1.105 dependencies, inklusive udviklingsdependencies. Ingen advisories er undertrykt.
- Hele monorepoets produktionsbuild og TypeScript-kontrol er kørt med succes.
- 37 tests for adgangskontrol, alle ni beskyttede API-handlers, CAPTCHA, JSON-grænser og sidens centrale navigation.
- Edge/Chromium: 320, 390, 768 og 1440 pixelbredder, lys/mørk tilstand, mobilmenu/Escape, 3D-pause, reduceret bevægelse og en rigtig lokal CAPTCHA-løsning. Ingen pageerrors eller vandret overflow. Ingen rigtige kontaktbeskeder blev sendt.
- `node scripts/verify-portfolio.cjs` gentager browserkontrollen mod en kørende lokal server på port 3000 (PREVIEW_URL og BROWSER_CHANNEL kan ændres). Serveren skal have en lokal ALTCHA_HMAC_KEY. Screenshots gemmes i .npm-cache.
- Repoets fulde ESLint-kontrol er fortsat ikke grøn: eksisterende `any`-typer, React Hooks-regler og ældre komponenter kræver separat oprydning. Reglerne er ikke slået fra for at skjule dette. Den gamle CI indeholder også legacy E2E-/formatkrav, som ikke er fuldt valideret i denne opgave.
- Live RLS, admin-sessioner, e-maillevering og rigtige Safari/Firefox-enheder er ikke verificeret. En ren dependency-audit er ikke en garanti for, at alle mulige sikkerhedsproblemer er fundet.

## Kilder

De fire advisories er kontrolleret mod GitHub: [nanoid](https://github.com/advisories/GHSA-xwg4-73v4-xw9w), [brace-expansion](https://github.com/advisories/GHSA-3jxr-9vmj-r5cp), [PostCSS source maps](https://github.com/advisories/GHSA-r28c-9q8g-f849), [PostCSS file read](https://github.com/advisories/GHSA-6g55-p6wh-862q). Installerede overrides er nyere end de angivne rettede versioner.

Den specifikke Medium-artikel kunne ikke hentes; dens 25 prompts er derfor ikke påstået fulgt. Designet er baseret på dit ønske om personlighed, tydelig navigation og responsivitet.

## Ekstra kontrol af spam-beskyttelsen

Begge nye migrationer er kørt mod en lokal PostgreSQL-motor (PGlite) med Supabase-lignende roller og tabeller. Testen kontrollerer genbrugt CAPTCHA, identisk besked, IP-grænser trods roterende e-mailadresser, afsender- og døgnbegrænsning, oprydning og rollback ved fejlet kontaktindsættelse. Den kontrollerer også, at gamle permissive RLS-regler ikke længere giver anonym/non-admin adgang. Det erstatter ikke en staging-test mod dit konkrete live-skema; PGlite-testen simulerer ikke flere samtidige serverprocesser.

Kør lokalt med `npm install --prefix .npm-cache/sql-test --ignore-scripts --no-package-lock @electric-sql/pglite` og `node scripts/verify-contact-database.cjs`. Dette testværktøj er isoleret fra applikationens dependencies. Kontakt og spamregistrering gemmes nu atomisk via submit_contact, så et databaseproblem ikke forbruger brugerens CAPTCHA uden at gemme beskeden. Spamregistre ældre end 24 timer fjernes ved næste indsendelse.

IP-headerens tillidsgrænse følger [Vercels dokumentation](https://vercel.com/docs/headers/request-headers). Ingen rigtige spam- eller kontaktbeskeder er sendt under testene. Beskyttelsen er endnu ikke aktiveret på din live-side; det kræver begge migrationer, miljøvariablerne og deployment.
