const { chromium } = require('playwright');
const expect = require('expect-playwright');
const nodemailer = require('nodemailer');
const fs = require('fs');

var today = new Date();
var datetime = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
var mail = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mymail',
        pass: 'mypassword'
    }
});
console.log(datetime + '_' + time);
(async () => {
    const browser = await chromium.launch({
        headless: true,
        slowMo: 250,
    });
    const context = await browser.newContext({
        viewport: {
            width: 1920,
            height: 1080
        }
    });
    const page = await context.newPage();
    await page.goto('some_eshop');
    await page.hover('text=Shoes');
    try {
        await page.waitForSelector('text=Shoes', { timeout: 5000 });
        await page.screenshot({ path: 'screenshot_ok_' + datetime + '_' + time + '_.png' });
    }
    catch (error) {
        console.error(error);
        await page.screenshot({ path: 'screenshot_not_ok_' + datetime + '_' + time + '_.png' });
        let mailOptions = {
            from: 'youremail',
            to: ['the developer\'s mail'],
            subject: 'Problem with mega menu detected',
            text: 'No megamenu detected at ' + datetime + ' @ ' + time + '.'
        };
        mail.sendMail(mailOptions, function (error, info) {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: ' + info.response);
        })
        fs.appendFile('meganenu.log', '\nProblem detected at ' + datetime, function (err) {
            if (err) throw err;
            console.log('Log has been saved!');
        });
    }
    await page.close();
    await context.close();
    await browser.close();
})();
