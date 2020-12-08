const puppeteer = require("puppeteer");

class Worker {
    constructor(title, link) {
        this.title = title;
        this.link = link;
    }
}

const findNextPageButton = async (page) => {
    await page.waitForSelector(".div_rmrb-date");

    // const linkList = await page.$$("a[target='_self']");
    const linkList = await page.$$eval("a[target='_self']", els => els.map(el => {
        console.log(el.innerHTML);
        return el.innerHTML;
    }));
    console.log(linkList);

    return null;
};

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

    // Build worker list.
    const workerList = [];

    for (;;) {
        // Get item list.
        const itemListSelector = ".div_rmrb-outlinetitle";
        page.waitForSelector(itemListSelector);
        const itemList = await page.$$(itemListSelector);

        for (let item of itemList) {
            const itemSelector = "a.ab18";
            let title = await item.$eval(itemSelector, el => el.innerHTML);
            let link = await item.$eval(itemSelector, el => el.getAttribute("href"));
            workerList.push(new Worker(title, link));
        }

        const nextButton = await findNextPageButton(page);
        console.log(nextButton);

        break;
    }

    // console.log(workerList);

    await page.screenshot({ path: "hello.png" });

    await browser.close();
})();
