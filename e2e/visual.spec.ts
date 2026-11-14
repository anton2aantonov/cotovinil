import { expect, test } from '@playwright/test'

test.skip(!process.env.VISUAL_CAPTURE, 'Run explicitly with VISUAL_CAPTURE=1')
test('capture home and result',async({page},testInfo)=>{
  await page.goto('/',{waitUntil:'domcontentloaded'})
  await expect(page.getByRole('heading',{name:'У каждого кота свой грув.'})).toBeVisible()
  await page.screenshot({path:testInfo.outputPath('home.png'),fullPage:true})
  await page.getByRole('button',{name:'Примеры'}).click()
  await page.getByRole('button',{name:'Луна'}).click()
  await page.getByRole('button',{name:'Распознать котика'}).click()
  await expect(page.getByRole('heading',{name:'Пластинка готова'})).toBeVisible()
  await page.screenshot({path:testInfo.outputPath('result.png'),fullPage:true})
})
