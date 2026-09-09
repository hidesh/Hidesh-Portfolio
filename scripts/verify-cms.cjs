// Isolated browser fixture: real UI components, fake auth/data, no live writes.
const fs = require('node:fs')
const path = require('node:path')
const http = require('node:http')
const { createRequire } = require('node:module')
const appRequire = createRequire(path.resolve('apps/web/package.json'))
const { build } = createRequire(appRequire.resolve('esbuild-register'))(
  'esbuild'
)
const { chromium, expect } = require('@playwright/test')
const out = path.resolve('.npm-cache/cms-preview')
fs.mkdirSync(out, { recursive: true })
;(async () => {
  await build({
    stdin: {
      contents: `import React from 'react'; import {createRoot} from 'react-dom/client'; import Dashboard from './src/app/cms/dashboard'; import Login from './src/app/login/page'; import {ThemeProvider} from './src/components/theme-provider'; createRoot(document.getElementById('root')).render(<ThemeProvider defaultTheme="light">{location.pathname==='/login'?<Login/>:<Dashboard/>}</ThemeProvider>);`,
      resolveDir: path.resolve('apps/web'),
      loader: 'tsx',
    },
    bundle: true,
    outfile: path.join(out, 'app.js'),
    jsx: 'automatic',
    define: { 'process.env.NODE_ENV': '"production"' },
    alias: { '@': path.resolve('apps/web/src') },
    plugins: [
      {
        name: 'isolated-fixture',
        setup(b) {
          b.onResolve(
            { filter: /^(next\/(navigation|link)|.*lib\/supabase\/client)$/ },
            a => ({ path: a.path, namespace: 'fixture' })
          )
          b.onLoad({ filter: /.*/, namespace: 'fixture' }, a => ({
            resolveDir: path.resolve('apps/web'),
            loader: 'jsx',
            contents:
              a.path === 'next/link'
                ? `import React from 'react'; export default function Link(props){return <a {...props}/>}`
                : a.path === 'next/navigation'
                  ? `const router={push:p=>window.lastNavigation=p,replace:p=>window.lastNavigation=p,refresh:()=>{}}; export const useRouter=()=>router; export const usePathname=()=>location.pathname;`
                  : `const user={email:'owner@example.com',app_metadata:{role:'admin'}};
        export function createClient(){return {auth:{getUser:async()=>({data:{user:location.pathname==='/login'?null:user}}),signInWithPassword:async()=>({error:null}),refreshSession:async()=>({data:{user},error:null}),signOut:async()=>({error:null})},from:table=>{let action='select',id,change;const q={select:()=>q,order:()=>q,update:x=>(action='update',change=x,q),delete:()=>(action='delete',q),eq:(key,value)=>(id=value,q),single:()=>q,then:resolve=>{let rows=window.fixtureMessages||[];if(action==='update')rows=rows.map(r=>r.id===id?{...r,...change}:r);if(action==='delete')rows=rows.filter(r=>r.id!==id);window.fixtureMessages=rows;return Promise.resolve({data:action==='select'?rows:{id},error:null}).then(resolve)}};return q}}}`,
          }))
        },
      },
    ],
  })
  const css = fs
    .readdirSync('apps/web/.next/static/chunks')
    .filter(f => f.endsWith('.css'))
    .map(f => fs.readFileSync(`apps/web/.next/static/chunks/${f}`, 'utf8'))
    .join('\n')
  fs.writeFileSync(
    path.join(out, 'styles.css'),
    css + '\n' + fs.readFileSync(path.join(out, 'app.css'), 'utf8')
  )
  const server = http.createServer((req, res) => {
    const file = { '/app.js': 'app.js', '/styles.css': 'styles.css' }[req.url]
    res.setHeader(
      'Content-Type',
      file?.endsWith('.js')
        ? 'text/javascript'
        : file
          ? 'text/css'
          : 'text/html'
    )
    res.end(
      file
        ? fs.readFileSync(path.join(out, file))
        : '<!doctype html><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="/styles.css"><div id="root"></div><script src="/app.js"></script>'
    )
  })
  await new Promise(r => server.listen(0, '127.0.0.1', r))
  const base = `http://127.0.0.1:${server.address().port}`
  const browser = await chromium.launch({ channel: 'msedge', headless: true })
  try {
    for (const width of [320, 390, 768, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } })
      const errors = []
      page.on('pageerror', e => errors.push(e.message))
      let posts = [
        {
          id: '1',
          title: 'Building with intention',
          excerpt:
            'Notes on thoughtful interfaces and the details that matter.',
          body_mdx: '## A fresh perspective\n\nContent for the test.',
          tags: ['Design'],
          published_at: '2026-01-01T12:00:00Z',
          created_at: '2026-01-01',
          slug: 'building',
        },
      ]
      let media = [
        {
          id: '1',
          name: 'cover.png',
          url: base + '/fixture.png',
          size: 1024,
          type: 'image/png',
          usedIn: [],
          created_at: '2026-01-01',
        },
      ]
      await page.addInitScript(() => {
        window.fixtureMessages = [
          {
            id: '1',
            name: 'Alex',
            email: 'alex@example.com',
            message: 'A conversation about a new project.',
            handled: false,
            created_at: '2026-01-01',
          },
          {
            id: '2',
            name: 'Sam',
            email: 'sam@example.com',
            message: 'Thank you!',
            handled: true,
            created_at: '2026-01-01',
          },
        ]
      })
      await page.route('**/fixture.png', route => route.fulfill({contentType:'image/png',body:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=','base64')}))
      await page.route('**/api/**', async route => {
        const url = new URL(route.request().url()),
          method = route.request().method()
        let result = { success: true }
        if (url.pathname === '/api/posts') {
          if (method === 'POST') {
            const p = route.request().postDataJSON()
            posts.push({ ...p, id: '2', created_at: '2026-01-01', slug: 'new' })
          }
          if (method === 'PUT') {
            const p = route.request().postDataJSON()
            posts = posts.map(x => (x.id === p.id ? { ...x, ...p } : x))
          }
          result = posts
        }
        if (url.pathname === '/api/upload') result = { url: media[0].url }
        if (url.pathname === '/api/media') {
          if (method === 'PATCH')
            media = media.map(x => ({
              ...x,
              name: route.request().postDataJSON().newName,
            }))
          if (method === 'DELETE') media = []
          result = { files: media }
        }
        if (url.pathname === '/api/clarity/insights')
          result = {
            totalSessions: 12,
            totalUsers: 8,
            pageViewsLast24h: 24,
            avgEngagementTime: 60,
            avgActiveTime: 30,
            avgScrollDepth: 50,
            deadClicks: 0,
            rageClicks: 0,
            scriptErrors: 0,
            errorClicks: 0,
            topPagesLast24h: [],
            rawMetrics: [],
          }
        await route.fulfill({ json: result })
      })
      page.on('dialog', d => d.accept())
      const fits = async () =>
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth
          )
        ).toBe(true)
      const tab = async name => {
        if (width < 1024)
          await page.getByRole('button', { name: 'Open navigation' }).click()
        await page.getByRole('button', { name, exact: true }).click()
      }
      await page.goto(base + '/cms')
      await expect(page.getByText('Building with intention')).toBeVisible()
      await fits()
      await page.screenshot({
        path: path.join(out, `cms-${width}.png`),
        fullPage: true,
      })
      await page.getByRole('button', { name: 'New post', exact: true }).click()
      await page.getByLabel('Title', { exact: true }).fill('New story')
      await page.getByLabel('Excerpt', { exact: true }).fill('A short excerpt')
      await page.getByLabel('Post content').fill('## Hello world')
      await page
        .locator('input[type=file]')
        .setInputFiles({
          name: 'fixture.png',
          mimeType: 'image/png',
          buffer: Buffer.from(
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=',
            'base64'
          ),
        })
      await expect(page.getByLabel('Post content')).toHaveValue(/<img/)
      await page.getByRole('button', { name: 'Preview', exact: true }).click()
      await expect(
        page.getByRole('heading', { name: 'Hello world' })
      ).toBeVisible()
      await fits()
      await page.screenshot({
        path: path.join(out, `editor-${width}.png`),
        fullPage: true,
      })
      await page
        .getByRole('button', { name: 'Create Post', exact: true })
        .click()
      await expect(page.getByText('New story', { exact: true })).toBeVisible()
      await tab('Messages')
      await expect(page.getByText('Alex', { exact: true })).toBeVisible()
      await fits()
      await page
        .getByRole('button', { name: 'Handled (1)', exact: true })
        .click()
      await expect(page.getByText('Sam', { exact: true })).toBeVisible()
      await expect(page.getByText('Alex', { exact: true })).toHaveCount(0)
      await page.getByRole('button', { name: 'All (2)', exact: true }).click()
      await page
        .getByRole('button', { name: 'Handled', exact: true })
        .first()
        .click()
      await expect(
        page.getByRole('button', { name: 'Handled (2)', exact: true })
      ).toBeVisible()
      await page.getByRole('button', { name: 'Delete message' }).first().click()
      await expect(
        page.getByRole('button', { name: 'All (1)', exact: true })
      ).toBeVisible()
      await tab('Media')
      await page.getByRole('button', { name: 'Open cover.png' }).click()
      await fits()
      await page.getByRole('button', { name: 'Omdøb' }).click()
      await page.getByLabel('New file name').fill('new-cover')
      await fits()
      await page.getByRole('button', { name: 'Gem', exact: true }).click()
      await expect(
        page.getByRole('button', { name: 'Open new-cover.png' })
      ).toBeVisible()
      await page.getByRole('button', { name: 'Open new-cover.png' }).click()
      await page.getByRole('button', { name: 'Slet', exact: true }).click()
      await expect(
        page.getByRole('button', { name: 'Open new-cover.png' })
      ).toHaveCount(0)
      await tab('Analytics')
      await expect(page.getByText('Total Sessions')).toBeVisible()
      await fits()
      await tab('Sign Out')
      await expect
        .poll(() => page.evaluate(() => window.lastNavigation))
        .toBe('/login')
      await page.goto(base + '/login')
      await expect(
        page.getByRole('heading', { name: 'Welcome back' })
      ).toBeVisible()
      await fits()
      await page.getByLabel('Email Address').fill('owner@example.com')
      await page
        .getByLabel('Password', { exact: true })
        .fill('fixture-password')
      await page.getByRole('button', { name: 'Show password' }).click()
      await expect(
        page.getByLabel('Password', { exact: true })
      ).toHaveAttribute('type', 'text')
      await page.screenshot({
        path: path.join(out, `login-${width}.png`),
        fullPage: true,
      })
      await page.getByRole('button', { name: 'Toggle theme' }).click()
      await fits()
      await page.screenshot({
        path: path.join(out, `login-dark-${width}.png`),
        fullPage: true,
      })
      await page.getByRole('button', { name: 'Sign In', exact: true }).click()
      await expect
        .poll(() => page.evaluate(() => window.lastNavigation))
        .toBe('/cms')
      expect(errors).toEqual([])
      await page.close()
      console.log(`CMS/login fixture passed at ${width}px`)
    }
  } finally {
    await browser.close()
    await new Promise(r => server.close(r))
  }
})().catch(e => {
  console.error(e)
  process.exitCode = 1
})
