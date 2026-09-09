const { chromium } = require('@playwright/test')
const assert = require('node:assert/strict')
require('node:fs').mkdirSync('.npm-cache', { recursive: true })
;(async () => {
  const browser = await chromium.launch({
    channel: process.env.BROWSER_CHANNEL || 'msedge',
    headless: true,
  })
  const results = []
  for (const [width, height, theme] of [
    [1440, 1000, 'light'],
    [1440, 1000, 'dark'],
    [768, 1024, 'light'],
    [390, 844, 'light'],
    [320, 740, 'dark'],
  ]) {
    const page = await browser.newPage({ viewport: { width, height } })
    await page.addInitScript(
      theme => localStorage.setItem('hidesh-portfolio-theme', theme),
      theme
    )
    const errors = []
    page.on('pageerror', e => errors.push(e.message))
    await page.goto(process.env.PREVIEW_URL || 'http://localhost:3000', {
      waitUntil: 'networkidle',
    })
    await page.getByRole('button', { name: 'Reject All', exact: true }).click()
    assert.equal(await page.locator('h1').count(), 1)
    assert.equal(
      await page.locator('html').evaluate(el => el.classList.contains('dark')),
      theme === 'dark'
    )
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth
      ),
      false,
      `Overflow at ${width}`
    )
    if (width < 1024) {
      const menu = page.getByRole('button', { name: 'Toggle mobile menu' })
      await menu.click()
      assert.equal(await menu.getAttribute('aria-expanded'), 'true')
      await page.keyboard.press('Escape')
      assert.equal(await menu.getAttribute('aria-expanded'), 'false')
    }
    const pause = page.getByRole('button', { name: 'Pause motion' })
    await pause.click()
    assert.equal(
      await page
        .getByRole('button', { name: 'Play motion' })
        .getAttribute('aria-pressed'),
      'true'
    )
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
    await page.screenshot({ path: `.npm-cache/hero-${width}-${theme}.png` })
    await page.locator('#about').scrollIntoViewIfNeeded()
    await page.locator('#contact').scrollIntoViewIfNeeded()
    const checkbox = page.locator('altcha-widget').getByRole('checkbox')
    await checkbox.click()
    await page
      .waitForFunction(
        () =>
          document
            .querySelector('altcha-widget')
            ?.querySelector('input[name="altcha"]')?.value ||
          document.querySelector('altcha-widget')?.value,
        undefined,
        { timeout: 15000 }
      )
      .catch(async () => {
        console.log(
          'Widget text',
          await page.locator('altcha-widget').innerText()
        )
        assert.ok(
          (await page.locator('altcha-widget').innerText()).includes('Verified')
        )
      })
    await page.screenshot({ path: `.npm-cache/contact-${width}-${theme}.png` })
    if (width === 390) {
      await page.getByLabel('Name', { exact: true }).fill('Preview visitor')
      await page
        .getByRole('textbox', { name: 'Email', exact: true })
        .fill('preview@example.com')
      await page.getByLabel('Subject', { exact: true }).fill('Test project')
      await page
        .locator('#message')
        .fill('This is a local intercepted UI test.')
      let submitted = false
      await page.route('**/api/contact', async route => {
        submitted = true
        assert.equal(route.request().postDataJSON().website, '')
        await route.fulfill({
          status: 429,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'Too many messages. Please try again later.',
          }),
        })
      })
      await page
        .getByRole('button', { name: 'Send Message', exact: true })
        .click()
      await page.locator('form').getByRole('alert').waitFor()
      assert.equal(submitted, true)
      assert.equal(
        await page.locator('#message').inputValue(),
        'This is a local intercepted UI test.'
      )
      assert.equal(await checkbox.isChecked(), false)
    }
    assert.deepEqual(errors, [])
    results.push({ width, height, theme, overflow: false, errors })
    await page.close()
  }
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    reducedMotion: 'reduce',
  })
  await page.goto(process.env.PREVIEW_URL || 'http://localhost:3000', {
    waitUntil: 'networkidle',
  })
  assert.equal(await page.locator('.signal-canvas canvas').count(), 0)
  assert.equal(await page.locator('.signal-fallback').count(), 1)
  console.log(
    JSON.stringify(
      { results, reducedMotion: 'static fallback verified' },
      null,
      2
    )
  )
  await browser.close()
})().catch(e => {
  console.error(e)
  process.exit(1)
})
