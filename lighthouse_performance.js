const { playAudit } = require('playwright-lighthouse');
const { chromium } = require('playwright');
const playwright = require('playwright');
const fs = require('fs');

var today = new Date();
var datetime = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
(async () => {
  const browser = await playwright['chromium'].launch({
    args: ['--remote-debugging-port=9222'],
  });
  const page = await browser.newPage();
  await page.goto('somwehere');
  await playAudit({
    page: page,
    reports: {
      formats: {
        json: true, //defaults to false
        html: true, //defaults to false
        csv: true //defaults to false
      },
      directory: './lighthouse_reports',
    },
    // I am interested in recording these values, so I have set the threshold very low. If the recorded values
    // are lower than the thresholds the script will fail. 
    thresholds: {
      performance: 10,
      accessibility: 10,
      'best-practices': 10,
      seo: 10,
      pwa: 10,
    },
    port: 9222,

  });
  await browser.close();
  // there is an issue with the latest playwright-lighthouse version that requires re-opening the broswer.
  const browser2 = await chromium.launch()
  const page2 = await browser2.newPage()
  await page2.goto('somewhere');

  const performanceTimingJson = await page2.evaluate(() => JSON.stringify(window.performance.timing));
  const performanceTiming = JSON.parse(performanceTimingJson);
  console.log(performanceTiming);
  const startToInteractive = performanceTiming.domInteractive - performanceTiming.navigationStart;
  console.log(`Navigation start to DOM interactive: ${startToInteractive}ms`);
  await browser.close();
  fs.appendFile('lighthouse_performance.log', '\nHomepage loaded within ' + startToInteractive + 'ms  at ' + datetime, function (err) {
    if (err) throw err;
    console.log('Log has been successfully saved.');
  });
  await browser2.close();
})()
