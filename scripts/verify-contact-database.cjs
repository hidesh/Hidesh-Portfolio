const {
  PGlite,
} = require('../.npm-cache/sql-test/node_modules/@electric-sql/pglite')
const fs = require('node:fs')
const assert = require('node:assert/strict')
const { createHash } = require('node:crypto')
const hash = value => createHash('sha256').update(value).digest('hex')
;(async () => {
  const db = new PGlite()
  await db.exec(`CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS;
 CREATE SCHEMA auth; CREATE SCHEMA storage;
 CREATE FUNCTION auth.jwt() RETURNS jsonb LANGUAGE sql AS $$ SELECT coalesce(nullif(current_setting('request.jwt.claims', true), '')::jsonb, '{}'::jsonb) $$;
 GRANT USAGE ON SCHEMA auth, storage, public TO anon, authenticated, service_role;
 CREATE TABLE public.contacts(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),name text NOT NULL,email text NOT NULL,message text NOT NULL,handled boolean DEFAULT false);
 CREATE TABLE storage.objects(id uuid DEFAULT gen_random_uuid(),bucket_id text);
 ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
 CREATE POLICY old_open ON storage.objects FOR ALL USING(true) WITH CHECK(true);
 CREATE POLICY old_open ON public.contacts FOR ALL USING(true) WITH CHECK(true);`)
  for (const table of [
    'profiles',
    'posts',
    'projects',
    'pageviews',
    'events',
    'clarity_analytics',
    'clarity_api_usage',
  ]) {
    await db.exec(
      `CREATE TABLE public.${table}(id uuid DEFAULT gen_random_uuid(),published_at timestamptz); CREATE POLICY old_open ON public.${table} FOR ALL USING(true) WITH CHECK(true);`
    )
  }
  await db.exec(
    'GRANT ALL ON ALL TABLES IN SCHEMA public, storage TO anon, authenticated, service_role;'
  )
  for (const file of [
    '20260909210000_harden_portfolio_access.sql',
    '20260909220000_contact_spam_protection.sql',
  ])
    await db.exec(fs.readFileSync('supabase/migrations/' + file, 'utf8'))
  const count = async table =>
    (await db.query(`SELECT count(*)::int AS n FROM ${table}`)).rows[0].n
  const submit = async ({
    nonce,
    email = 'a@test.example',
    ip = 'ip-a',
    message = 'Hello project',
    name = 'Tester',
  }) =>
    (
      await db.query(
        'SELECT public.submit_contact($1,$2,$3,$4,$5,$6,$7,$8) AS result',
        [
          hash(nonce),
          hash(email),
          hash(ip),
          hash(message),
          name,
          email,
          'Project inquiry',
          message,
        ]
      )
    ).rows[0].result
  assert.equal((await submit({ nonce: 'one' })).status, 'accepted')
  assert.equal(
    (
      await submit({
        nonce: 'one',
        email: 'b@test.example',
        ip: 'different',
        message: 'Different message',
      })
    ).status,
    'replayed'
  )
  assert.equal(
    (await submit({ nonce: 'two', email: 'b@test.example', ip: 'different' }))
      .status,
    'duplicate'
  )
  assert.equal(await count('contacts'), 1)
  await db.exec('TRUNCATE contacts, contact_admissions')
  for (let i = 0; i < 5; i++)
    assert.equal(
      (
        await submit({
          nonce: 'ip-' + i,
          email: `rotate${i}@test.example`,
          message: 'unique-' + i,
        })
      ).status,
      'accepted'
    )
  assert.equal(
    (
      await submit({
        nonce: 'ip-6',
        email: 'rotated@test.example',
        message: 'unique-6',
      })
    ).status,
    'rate_limited'
  )
  assert.equal(await count('contacts'), 5)
  await db.exec('TRUNCATE contacts, contact_admissions')
  for (let i = 0; i < 3; i++)
    assert.equal(
      (
        await submit({
          nonce: 'sender-' + i,
          ip: 'ip' + i,
          message: 'sender-unique-' + i,
        })
      ).status,
      'accepted'
    )
  assert.equal(
    (await submit({ nonce: 'sender-4', ip: 'ip4', message: 'sender-unique-4' }))
      .status,
    'rate_limited'
  )
  await db.exec('TRUNCATE contacts, contact_admissions')
  for (let i = 0; i < 20; i++) {
    await db.exec(
      "UPDATE contact_admissions SET created_at=now()-interval '1 hour'"
    )
    assert.equal(
      (
        await submit({
          nonce: 'daily-' + i,
          email: `daily${i}@test.example`,
          message: 'daily-unique-' + i,
        })
      ).status,
      'accepted'
    )
  }
  assert.equal(
    (
      await submit({
        nonce: 'daily-21',
        email: 'day21@test.example',
        message: 'daily-unique-21',
      })
    ).status,
    'rate_limited'
  )
  await db.exec(
    "UPDATE contact_admissions SET created_at=now()-interval '25 hours'"
  )
  assert.equal(
    (await submit({ nonce: 'day-two', message: 'new day' })).status,
    'accepted'
  )
  assert.equal(await count('contact_admissions'), 1)
  await db.exec('TRUNCATE contacts, contact_admissions')
  await db.exec(
    "ALTER TABLE contacts ADD CONSTRAINT test_failure CHECK(name <> 'force-failure')"
  )
  await assert.rejects(() => submit({ nonce: 'retry', name: 'force-failure' }))
  assert.equal(await count('contact_admissions'), 0)
  assert.equal((await submit({ nonce: 'retry' })).status, 'accepted')
  // Verify restrictive policies constrain even an old public FOR ALL policy.
  await db.exec('SET ROLE anon')
  assert.equal(await count('contacts'), 0)
  await assert.rejects(() =>
    db.exec(
      "INSERT INTO contacts(name,email,message) VALUES('Bot','bot@test.example','Spam')"
    )
  )
  await assert.rejects(() => submit({ nonce: 'anonymous' }))
  await db.exec(
    "RESET ROLE; SET ROLE authenticated; SET request.jwt.claims='{}'"
  )
  assert.equal(await count('contacts'), 0)
  await assert.rejects(() =>
    db.exec("INSERT INTO storage.objects(bucket_id) VALUES('blog-images')")
  )
  await db.exec(`SET request.jwt.claims='{"app_metadata":{"role":"admin"}}'`)
  assert.equal(await count('contacts'), 1)
  await db.exec("INSERT INTO storage.objects(bucket_id) VALUES('blog-images')")
  await db.exec('RESET ROLE')
  await db.close()
  console.log(
    'PASS: both PostgreSQL migrations, CAPTCHA replay, duplicate messages, rotating-email IP limit, sender limit, daily limit, expiry cleanup, atomic rollback, anonymous/non-admin RLS, admin access'
  )
})().catch(error => {
  console.error(error)
  process.exit(1)
})
