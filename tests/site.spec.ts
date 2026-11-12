import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

for (const mode of ['desktop', 'mobile', 'reduced'] as const) {
  test(`${mode}: complete portfolio journey`, async ({ page }) => {
    await page.setViewportSize(mode === 'mobile' ? { width: 390, height: 844 } : { width: 1440, height: 1000 })
    await page.emulateMedia({ reducedMotion: mode === 'reduced' ? 'reduce' : 'no-preference' })
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) })
    const response = await page.goto('/')
    expect(response?.status()).toBe(200)
    await page.waitForTimeout(4000)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.screenshot({ path: `test-results/${mode}-hero.png` })
    if (mode === 'mobile') {
      await page.getByRole('button', { name: 'Open navigation' }).click()
      await page.locator('#mobile-nav').getByRole('link', { name: 'Selected work' }).click()
      await expect(page.locator('#mobile-nav')).toHaveCount(0)
    }
    await page.locator('#projects').scrollIntoViewIfNeeded()
    await page.waitForTimeout(900)
    await page.getByRole('button', { name: 'Explore The Silent Residence', exact: true }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.locator('#dialog-title')).toHaveText('The Silent Residence')
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).not.toBeVisible()
    if (mode === 'desktop') {
      const section = await page.locator('#projects').evaluate(el => el.getBoundingClientRect().top + scrollY)
      await page.evaluate(y => window.scrollTo(0, y + 2000), section)
      await page.waitForTimeout(1000)
      expect(await page.locator('.project-track').evaluate(el => getComputedStyle(el).transform)).not.toBe('none')
    }
    for (const id of ['studio', 'featured', 'approach', 'contact']) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded()
      await page.waitForTimeout(450)
      await expect(page.locator(`#${id}`)).toBeVisible()
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    }
    await page.getByRole('button', { name: 'Preview inquiry' }).click()
    await expect(page.locator('#name-error')).toBeVisible()
    await page.getByLabel('Your name').fill('Alex Morgan')
    await page.getByLabel('Email address').fill('invalid')
    await page.getByLabel('What do you have in mind?').fill('A considered residential concept with natural daylight and tactile materials.')
    await page.getByRole('button', { name: 'Preview inquiry' }).click()
    await expect(page.locator('#email-error')).toBeVisible()
    await page.getByLabel('Email address').fill('alex@example.com')
    await page.getByRole('button', { name: 'Preview inquiry' }).click()
    await expect(page.getByRole('status')).toContainText('Nothing has been sent or stored')
    await page.waitForTimeout(1500)
    const results = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()
    expect(results.violations.map(v => `${v.id}: ${v.nodes.map(n => n.target).join(',')}`)).toEqual([])
    expect(errors).toEqual([])
    expect(await page.locator('img').evaluateAll(imgs => imgs.every(img => (img as HTMLImageElement).complete && (img as HTMLImageElement).naturalWidth > 0))).toBe(true)
    await page.screenshot({ path: `test-results/${mode}-contact.png` })
  })
}

test('responsive geometry and motion preference cleanup', async ({ page }) => {
  await page.goto('/')
  for (const width of [320, 768, 1024, 1920]) {
    await page.setViewportSize({ width, height: 900 })
    await page.waitForTimeout(500)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
  await expect(page.locator('.pin-spacer')).toHaveCount(1)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(page.locator('.pin-spacer')).toHaveCount(0)
  expect(await page.locator('.project-track').evaluate(el => new DOMMatrix(getComputedStyle(el).transform).m41)).toBe(0)
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await expect(page.locator('.pin-spacer')).toHaveCount(1)
})
