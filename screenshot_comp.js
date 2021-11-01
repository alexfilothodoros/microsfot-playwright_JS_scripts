const { test, expect } = require('@playwright/test');
const { chromium } = require('playwright');

test('listing_icons', async ({ page }) => {
  const browser = await chromium.launch({
    headless: true,
    slowMo: 250,
  });
  const context = await browser.newContext({
    viewport: {
      width: 1920,
      height: 1080}});
  var page = await context.newPage();
  await page.goto('somewhere');
  await page.waitForNavigation();
  // expect(await page.screenshot({ fullPage: true })).toMatchSnapshot('nisthoehlep2.png');
  expect(await page.screenshot({ path: `listing_icons.png`, fullPage: true })).toMatchSnapshot('listing_icons.png');

});


