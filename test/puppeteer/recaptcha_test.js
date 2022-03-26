const puppeteer = require("puppeteer");
// import * as puppeteer from "puppeteer";

const gotoAndWait = async (page, url) => {
  await Promise.all([page.waitForNavigation(), page.goto(url)]);
};

const main = async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  await gotoAndWait(page, "http://localhost:3000");
  await page.type('input[name="email"]', "info@example.com", { delay: 100 });
  await page.type('textarea[name="body"]', "testtest\ntesttest", {
    delay: 100,
  });
  await page.click("#contact-button");
  await browser.close();
};

main()
  .then(() => console.log("success"))
  .catch((error) => console.warn(error));
