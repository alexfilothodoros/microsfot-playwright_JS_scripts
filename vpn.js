const playwright = require('playwright');
const { chromium } = require('playwright');

const launchOptions = {
    headless: false,
    proxy: {
        server: 'xxx.xxx.xxx.x:xx' // provide some IP here
    }
};

(async () => {
    const browser = await chromium.launch(launchOptions);
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://somewhere');
    await page.waitForTimeout(5000);
    await browser.close();
  
})();