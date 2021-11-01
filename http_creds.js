const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({
        headless: false,
        slowMo: 250,
    });

    const context = await browser.newContext({
        httpCredentials: {
            username: 'username',
            password: 'password',
        },
        viewport: {
            width: 1920,
            height: 1080
        }
    });
    await context.cookies();

    const page = await context.newPage();
    await page.goto('somewhere');
    // do something


    await page.waitForTimeout(3000);
    await browser.close()
    await page.close();
    // ---------------------
    await context.close();
    await browser.close();
})();