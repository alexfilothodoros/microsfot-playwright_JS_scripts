const { chromium } = require('playwright');
const fs = require('fs');
var nodemailer = require('nodemailer');

var currentdate = new Date();
var datetime = (currentdate.getMonth() + 1) + "/"
  + currentdate.getFullYear() + " @ "
  + currentdate.getHours() + ":"
  + currentdate.getMinutes() + ":"
  + currentdate.getSeconds();
(async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.goto('some_url');

  const performanceTimingJson = await page.evaluate(() => JSON.stringify(window.performance.timing));
  const performanceTiming = JSON.parse(performanceTimingJson);
  console.log(performanceTiming);
  const startToInteractive = performanceTiming.domInteractive - performanceTiming.navigationStart;
  console.log(`Navigation start to DOM interactive: ${startToInteractive}ms`);
  await browser.close();
  fs.appendFile('wodewa_performance.log', '\nHomepage loaded within ' + startToInteractive +'ms  at ' + datetime, function (err) {
    if (err) throw err;
    console.log('Log has been successfully saved.');
  });
  var mail = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your_mail',
      pass: 'your_password'
    }
  });
  var mailOptions = {
    from: 'sender_mail',
    to: 'receiver_mail',
    subject: 'Today\'s performace test\'s results',
    text: 'the performance of your shop was measured today at ' + datetime + '. The hoemapge was loaded in: ' +  startToInteractive +'ms. The rest of the performance details have been saved in our server.'
  };
  mail.sendMail(mailOptions, function (error, info) {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: ' + info.response);
  });
})()