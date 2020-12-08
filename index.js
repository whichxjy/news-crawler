const puppeteer = require("puppeteer");
const { writeContentToDocs } = require("./docs");

class Worker {
    constructor(title, link) {
        this.title = title;
        this.link = link;
    }
}

const findNextPageLink = async (page) => {
    await page.waitForSelector(".div_rmrb-date");

    const linkList = await page.$$eval("a[target='_self']", els => els
        .filter(el => el.innerText === "下一页")
        .map(el => el.getAttribute("href")));

    if (linkList.length >= 1) {
        return linkList[0];
    }

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
        await page.waitForSelector(itemListSelector);
        const itemList = await page.$$(itemListSelector);

        for (let item of itemList) {
            const itemSelector = "a.ab18";
            let title = await item.$eval(itemSelector, el => el.innerText);
            let link = await item.$eval(itemSelector, el => el.getAttribute("href"));

            let worker = new Worker(title, link);
            console.log(`Build worker ${worker.title}`);
            workerList.push(worker);
        }

        const nextPageLink = await findNextPageLink(page);
        if (nextPageLink === null) {
            break;
        }

        // Go to next page.
        await page.goto(nextPageLink);
    }

    // Work on all links.
    for (let worker of workerList) {
        console.log(`Start work on ${worker.title}`);

        await page.goto(worker.link);
        await page.waitForSelector("#fontzoom");

        // Write content.
        const textList = await page.$$eval("#fontzoom p", els => els.map(el => el.innerText));
        const content = textList.join("\n");
        writeContentToDocs(worker.title, content);
    }

    console.log("Done");

    await browser.close();
})();
