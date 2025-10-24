# Admin User Setup Instructions

## Hvordan man opretter admin brugeren i Supabase

1. **Gå til Supabase Dashboard:**
   - Åben din Supabase projekts dashboard
   - Naviger til "SQL Editor" sektionen

2. **Kør SQL script:**
   - Kopier indholdet fra `setup_admin_user.sql`
   - Indsæt det i SQL editoren
   - Klik "RUN" for at eksekvere scriptet

3. **Admin Login Credentials:**
   - Email: `hidesh@live.dk`
   - Password: `Test123!`

## Hvad er ændret:

✅ **Fjernet hardcoded authentication:**
- Ingen dummy cookies længere
- Kun Supabase authentication

✅ **Opdateret middleware:**
- Kun tjekker Supabase user session
- Redirecter korrekt til/fra login siden

✅ **Opdateret login komponent:**
- Ingen hardcoded credentials i koden
- Proper error handling
- Respekterer redirect URLs

✅ **Fixed TypeScript errors:**
- Middleware cookie typing
- Removed unused parameters

## Test Login:
1. Gå til http://localhost:3000/login
2. Brug admin credentials efter at have kørt SQL scriptet
3. Du vil blive redirected til /cms efter succesfuldt login

## Næste step:
Kør SQL scriptet i Supabase dashboard for at oprette admin brugeren.