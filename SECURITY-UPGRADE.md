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
2. Ejerens administratorrolle er nu tildelt manuelt i Supabase og login bekræftet af ejeren. Engangsscriptet er slettet efter brug og dets sti er Git-ignoreret. Login tildeler ingen roller og bruger ingen service-role-nøgle.
3. Kør først `supabase/migrations/20260909210000_harden_portfolio_access.sql` og derefter `supabase/migrations/20260909220000_contact_spam_protection.sql` på den eksisterende database. Den forudsætter eksisterende `published_at`-kolonner, som applikationen allerede bruger. Test migration og admin-adgang i staging først. Gamle migrationer har modstridende skemaer og bør ikke genafspilles blindt på en ny database.
4. Sæt NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY, CONTACT_EMAIL og ALTCHA_HMAC_KEY. Lokalt placeres værdier i apps/web/.env.local; på Vercel i projektets miljøvariabler. ALTCHA_HMAC_KEY skal være en unik tilfældig hemmelighed på mindst 32 tegn. Generér f.eks. med `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`.
5. Sæt eventuelle Clarity-variabler. Kontroller en rigtig admin-session, upload/omdøbning, blogredigering og kontaktbesked i staging. En kontaktformular uden migration/konfiguration afviser sikkert og viser en alternativ e-mailadresse.
6. Deploy ændringerne. GitHubs Dependabot-advarsler lukkes først efter opdateringen er på den overvågede branch og GitHub har scannet den.

## Verifikation

- pnpm audit: **0 kendte sårbarheder**, 1.105 dependencies, inklusive udviklingsdependencies. Ingen advisories er undertrykt.
- Hele monorepoets produktionsbuild og TypeScript-kontrol er kørt med succes.
- 52 tests for adgangskontrol, API-handlers, CAPTCHA, JSON-grænser, sidens centrale navigation og afvisning af automatisk rollegendannelse samt opdatering af sessionen.
- Edge/Chromium: 320, 390, 768 og 1440 pixelbredder, lys/mørk tilstand, mobilmenu/Escape, 3D-pause, reduceret bevægelse og en rigtig lokal CAPTCHA-løsning. Ingen pageerrors eller vandret overflow. Ingen rigtige kontaktbeskeder blev sendt.
- `node scripts/verify-portfolio.cjs` gentager browserkontrollen mod en kørende lokal server på port 3000 (PREVIEW_URL og BROWSER_CHANNEL kan ændres). Serveren skal have en lokal ALTCHA_HMAC_KEY. Screenshots gemmes i .npm-cache.
- Repoets fulde ESLint-kontrol er fortsat ikke grøn: eksisterende `any`-typer, React Hooks-regler og ældre komponenter kræver separat oprydning. Reglerne er ikke slået fra for at skjule dette. Den gamle CI indeholder også legacy E2E-/formatkrav, som ikke er fuldt valideret i denne opgave.
- Live RLS, admin-sessioner, e-maillevering og rigtige Safari/Firefox-enheder er ikke verificeret. En ren dependency-audit er ikke en garanti for, at alle mulige sikkerhedsproblemer er fundet.

## Rettelser efter fejlrapport fra iPhone

CAPTCHA-challengens `expires` sendes nu som Unix-sekunder, som ALTCHA forventer. Millisekunder fik widgettens udløbstimer til at overskride browserens timergrænse og udløbe næsten straks. Serverkontrollen bruger samme enhed. `scripts/verify-captcha-expiry.cjs` er kørt med Chromium og WebKit i mobilstørrelse: en løst CAPTCHA forbliver gyldig efter 20 sekunder og udløber efter fem minutter. Testen bruger browserens virtuelle ur; den er ikke en test på en fysisk iPhone. WebKit installeres med `playwright install webkit`; scriptet kræver en kørende lokal server med ALTCHA_HMAC_KEY.

Login-afvisningen skyldtes det nye administratorrollekrav, ikke en ændret adgangskode. Efter sikkerhedsgennemgangen er automatisk gendannelse ud fra e-mail fjernet. Same-origin-endpointet `/api/auth/admin-session` bruger kun `auth.getUser()` og kontrollerer eksisterende serverstyrede roller; det bruger ingen service-role-nøgle og ændrer ingen konti. En fjernet rolle forbliver fjernet. Ejeren har efterfølgende kørt engangs-SQL med sit faste bruger-id og bekræftet, at live-login virker. Engangsscriptet er derefter slettet fra workspace. De seneste kodeændringer er ikke deployet i denne opgave.

Git ignorerer nu alle `.env*`-filer undtagen `.env.example`, inklusive backup- og testvarianter. Clarity-modulet med den private API-token har også en eksplicit `server-only`-grænse.

Live-opfølgning: kontroller Supabase Auths login-rategrænser og e-mailbekræftelse, og deaktiver offentlig tilmelding, hvis kun ejeren skal bruge Auth. MFA er ikke implementeret eller påkrævet i denne ændring; det kræver et komplet tilmeldings-/challengeforløb og AAL2-kontrol på både API og RLS, før det kan håndhæves uden at låse ejeren ude. Ingen live-indstillinger eller nøgler er ændret.

## Kilder

De fire advisories er kontrolleret mod GitHub: [nanoid](https://github.com/advisories/GHSA-xwg4-73v4-xw9w), [brace-expansion](https://github.com/advisories/GHSA-3jxr-9vmj-r5cp), [PostCSS source maps](https://github.com/advisories/GHSA-r28c-9q8g-f849), [PostCSS file read](https://github.com/advisories/GHSA-6g55-p6wh-862q). Installerede overrides er nyere end de angivne rettede versioner.

Den specifikke Medium-artikel kunne ikke hentes; dens 25 prompts er derfor ikke påstået fulgt. Designet er baseret på dit ønske om personlighed, tydelig navigation og responsivitet.

## Ekstra kontrol af spam-beskyttelsen

Begge nye migrationer er kørt mod en lokal PostgreSQL-motor (PGlite) med Supabase-lignende roller og tabeller. Testen kontrollerer genbrugt CAPTCHA, identisk besked, IP-grænser trods roterende e-mailadresser, afsender- og døgnbegrænsning, oprydning og rollback ved fejlet kontaktindsættelse. Den kontrollerer også, at gamle permissive RLS-regler ikke længere giver anonym/non-admin adgang. Det erstatter ikke en staging-test mod dit konkrete live-skema; PGlite-testen simulerer ikke flere samtidige serverprocesser.

Kør lokalt med `npm install --prefix .npm-cache/sql-test --ignore-scripts --no-package-lock @electric-sql/pglite` og `node scripts/verify-contact-database.cjs`. Dette testværktøj er isoleret fra applikationens dependencies. Kontakt og spamregistrering gemmes nu atomisk via submit_contact, så et databaseproblem ikke forbruger brugerens CAPTCHA uden at gemme beskeden. Spamregistre ældre end 24 timer fjernes ved næste indsendelse.

IP-headerens tillidsgrænse følger [Vercels dokumentation](https://vercel.com/docs/headers/request-headers). Ingen rigtige spam- eller kontaktbeskeder er sendt under testene. Beskyttelsen er endnu ikke aktiveret på din live-side; det kræver begge migrationer, miljøvariablerne og deployment.

## CMS og login – responsivt design og funktionskontrol

Login og CMS bruger nu portfolioens grønne/cremefarvede design med kobberfarvede handlinger, større trykflader og mobiltilpasset editor. Dialoger holder tastaturfokus og understøtter Escape. Indlæg hentes ikke længere dobbelt, eksisterende publiceringstid bevares ved redigering, og fejlet gemning bevarer kladden. Beskedfiltre beholder korrekte tællere. Mediefejl vises med genforsøg; omdøbning lukker gamle filoplysninger, og gentagen billedskalering bruger opdaterede tekstpositioner.

`node scripts/verify-cms.cjs` bygger et isoleret UI-testmiljø i `.npm-cache/cms-preview` med de rigtige komponenter og fiktiv auth/API. Det tilføjer ingen testadgang til Next.js-applikationen. Browserkontrollen dækker 320/390/768/1440 px, login og passwordvisning, tema, navigation, oprettelse/preview/upload, beskedfiltre/status/sletning, medier/omdøbning/sletning, analytics-visning og logout. Unit-tests dækker også redigering med bevaret dato samt fejl ved gemning og hentning. Produktionsbuild og 52 tests består. Browser-testene beviser ikke live-mail, Clarity-sync eller Supabase/RLS-mutationer på den deployede database; de kræver kontrol efter deployment.

Engangsscriptet er fjernet og ignoreret. De almindelige testværktøjer under scripts beholdes til vedligeholdelse; de indeholder ingen private nøgler og ligger ikke under Next.js public-mappen. Git-ignore fjerner ikke eventuelle tidligere commits fra historikken.
