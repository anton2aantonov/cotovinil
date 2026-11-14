import { expect, test } from '@playwright/test'
import { join } from 'node:path'

test.skip(!process.env.AI_SMOKE, 'Run explicitly with AI_SMOKE=1; downloads external model weights')
test('real local cat inference',async({page})=>{
  test.setTimeout(240000)
  await page.goto('/',{waitUntil:'domcontentloaded'})
  await page.locator('input[type=file]').setInputFiles(join(process.cwd(),'public','samples','ginger.jpg'))
  await page.getByRole('button',{name:'Распознать котика'}).click()
  await expect(page.getByRole('heading',{name:'Пластинка готова'})).toBeVisible({timeout:220000})
  await expect(page.getByText('ДЕМО · без AI-анализа')).toHaveCount(0)
  console.log('AI result:',await page.locator('.breed-card h3').first().textContent())
  console.log('AI warning:',await page.locator('.upload-panel .form-error').allTextContents())
})
