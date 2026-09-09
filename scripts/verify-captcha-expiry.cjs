const { chromium, webkit, expect } = require('@playwright/test')
const assert = require('node:assert/strict')
;(async () => {
  for (const engine of ['chromium', 'webkit']) {
    const browser = await (engine === 'webkit' ? webkit.launch() : chromium.launch({ channel: 'msedge' }))
    try {
      const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
      await page.clock.install({ time: new Date() })
      await page.goto('http://localhost:3000', { waitUntil: 'networkidle' })
      await page.getByRole('button', { name: 'Reject All', exact: true }).click()
      await page.locator('#contact').scrollIntoViewIfNeeded()
      const checkbox = page.locator('altcha-widget').getByRole('checkbox')
      await checkbox.click()
      await expect(checkbox).toBeChecked({ timeout: 15000 })
      await page.clock.fastForward(20000)
      await expect(checkbox).toBeChecked()
      assert.equal(await page.locator('altcha-widget').getByText('Verification expired. Try again.', { exact: true }).isVisible(), false)
      await page.screenshot({ path: `.npm-cache/captcha-fixed-${engine}.png` })
      await page.clock.fastForward(301000)
      await expect(checkbox).not.toBeChecked()
      console.log(`${engine}: verified remains valid after 20 seconds; expires after its real five-minute lifetime`)
    } finally { await browser.close() }
  }
})().catch(error => { console.error(error); process.exit(1) })
