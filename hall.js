const puppeteer = require("puppeteer-core");

(async () => {
  const browser = await puppeteer.launch({ 
     headless: false,
    executablePath: '/nix/store/x205pbkd5xh5g4iv0g58xjla55has3cx-chromium-108.0.5359.94/bin/chromium-browser', 
    args: ['--no-sandbox'],
    slowMo: 1000
  });
  const page = await browser.newPage();

  // Wait for the page to load completely
  await page.goto('https://hall_ticket.ignou.ac.in/HALLticketjun23/IGNOUHallTicketJun2023.aspx', { waitUntil: 'networkidle0' });

  // Wait for the form to load completely
  // await page.waitForSelector('#txtEnrNo');

  await page.type('#txtEnrNo', '2100791043');
  await page.select('#ddlProgram', 'BCA');
   await page.screenshot({ path: 'example.png' });
  
console.log("yes running")
  // Click on the hidden submit button using evaluate
// select submit button and click on it
// await page.waitForSelector('input[type="hidden"][name="submit1"]');
// const submitBtn = await page.$('input[type="hidden"][name="submit1"]');
// await submitBtn.click();

  // // Wait for the checkbox to load completely
  // await page.waitForSelector('#CheckDeclaration');

  // // select checkbox and click on it
  // const checkbox = await page.$('#CheckDeclaration');
  // await checkbox.click();

  // // select submit button and click on it
  // const submitBtnN = await page.$('#submitDeclaration');
  // await submitBtnN.click();

  // await browser.close();
})();
