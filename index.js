const puppeteer = require("puppeteer");

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("http://10.8.11.170/web/index.htm");
    await page.screenshot({ path: "hello.png" });

    await browser.close();
})();