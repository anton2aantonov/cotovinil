import { expect, test } from '@playwright/test'

test('@layout six widths across every route', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'One browser covers all six viewport widths')
  test.setTimeout(120000)
  await page.goto('/')
  await page.getByRole('button', { name: 'Примеры' }).click()
  await page.getByRole('button', { name: 'Рыжик' }).click()
  await page.getByRole('button', { name: 'Распознать котика' }).click()
  await page.getByRole('button', { name: 'Сохранить пластинку' }).click()
  await expect(page.getByRole('button', { name: 'Сохранено' })).toBeVisible()
  await page.goto('/collection')
  const detail = await page.getByRole('link', { name: /Рыжик:/ }).getAttribute('href')
  expect(detail).toBeTruthy()
  const routes = [
    ['home', '/'], ['collection', '/collection'], ['detail', detail!],
    ['about', '/about'], ['settings', '/settings'], ['404', '/missing-page'],
  ] as const
  for (const width of [320, 375, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    for (const [name, route] of routes) {
      await page.goto(route, { waitUntil: 'domcontentloaded' })
      await expect(page.locator('main')).toBeVisible()
      if (name === 'collection' || name === 'detail') {
        await expect.poll(() => page.locator('canvas.album-cover').first().evaluate(canvas => (canvas as HTMLCanvasElement).width)).toBe(600)
      }
      const sizes = await page.evaluate(() => ({ document: document.documentElement.scrollWidth, viewport: innerWidth }))
      expect(sizes.document, `${name} at ${width}px`).toBeLessThanOrEqual(sizes.viewport)
      await page.screenshot({ path: testInfo.outputPath(`${width}-${name}.png`) })
    }
  }
})
