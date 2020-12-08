const puppeteer = require("puppeteer");

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("http://10.8.11.170/web/images/101/101index.htm");

    // Type search word.
    const searchSelector = "input[name='searchword1']";
    await page.waitForSelector(searchSelector);
    await page.type(searchSelector, "一天一天");

    // Submit search.
    await Promise.all([
        page.waitForNavigation(),
        page.click("input[title='提交检索']"),
    ]);

    // Get item list.
    const itemList = await page.$$(".div_rmrb-outlinetitle");
    for (let item of itemList) {
        let link = await item.$eval("a.ab18", el => el.getAttribute("href"));
        let title = await item.$eval("a.ab18", el => el.innerHTML);
        console.log(title, link);
    }

    await page.screenshot({ path: "hello.png" });

    await browser.close();
})();
