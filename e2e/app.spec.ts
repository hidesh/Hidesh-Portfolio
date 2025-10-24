import { test, expect } from '@playwright/test';

test.describe('Portfolio Application', () => {
  test('homepage loads correctly', async ({ page }) => {
    await page.goto('/')
    
    // Check basic elements
    await expect(page).toHaveTitle(/Hidesh/)
    await expect(page.locator('h1')).toBeVisible()
    
    // Check navigation
    await expect(page.locator('nav')).toBeVisible()
    
    // Check no console errors
    const logs: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        logs.push(msg.text())
      }
    })
    
    await page.waitForLoadState('networkidle')
    expect(logs).toHaveLength(0)
  })

  test('navigation works', async ({ page }) => {
    await page.goto('/')
    
    // Test blog navigation
    await page.click('text=Blog')
    await expect(page).toHaveURL('/blog')
    
    // Test projects navigation  
    await page.click('text=Projects')
    await expect(page).toHaveURL('/projects')
    
    // Test about navigation
    await page.click('text=About')
    await expect(page).toHaveURL('/about')
  })

  test('blog page functionality', async ({ page }) => {
    await page.goto('/blog')
    
    // Check blog posts are loaded
    await expect(page.locator('article, .blog-post')).toBeVisible()
    
    // Test search if available
    const searchInput = page.locator('input[type="search"]')
    if (await searchInput.isVisible()) {
      await searchInput.fill('test')
      await expect(searchInput).toHaveValue('test')
    }
  })

  test('accessibility standards', async ({ page }) => {
    await page.goto('/')
    
    // Check for alt attributes on images
    const images = await page.locator('img').all()
    for (const img of images) {
      const alt = await img.getAttribute('alt')
      expect(alt).toBeTruthy()
    }
    
    // Check for proper heading structure
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBeGreaterThanOrEqual(1)
    expect(h1Count).toBeLessThanOrEqual(1) // Only one H1 per page
  })

  test('performance metrics', async ({ page }) => {
    await page.goto('/')
    
    // Measure load time
    const startTime = Date.now()
    await page.waitForLoadState('networkidle')
    const loadTime = Date.now() - startTime
    
    expect(loadTime).toBeLessThan(3000) // Should load within 3 seconds
    
    // Check for layout shift
    const cls = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const cls = entries.reduce((acc, entry) => acc + (entry as any).value, 0)
          resolve(cls)
        }).observe({ entryTypes: ['layout-shift'] })
        
        setTimeout(() => resolve(0), 5000) // Timeout after 5s
      })
    })
    
    expect(cls).toBeLessThan(0.1) // Good CLS score
  })

  test('responsive design', async ({ page }) => {
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    // Check mobile navigation
    const mobileMenu = page.locator('button[aria-label*="menu"], .mobile-menu-button')
    if (await mobileMenu.isVisible()) {
      await mobileMenu.click()
      await expect(page.locator('nav')).toBeVisible()
    }
    
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.reload()
    await expect(page.locator('main')).toBeVisible()
    
    // Test desktop view
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.reload()
    await expect(page.locator('main')).toBeVisible()
  })
})