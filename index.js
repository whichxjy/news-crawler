const puppeteer = require("puppeteer");

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("http://10.8.11.170/web/images/101/101index.htm");

    // Type search word.
    const searchSelector = "input[name='searchword1']";
    await page.waitForSelector(searchSelector);
    await page.type(searchSelector, "Hello");

    await page.screenshot({ path: "hello.png" });

    await browser.close();
})();
