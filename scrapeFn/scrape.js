const puppeteer = require("puppeteer");
const data = {
    list: []
}

async function main(skill) {
    //launches chrome
    const browser = await puppeteer.launch({ headless: false}); // gdyby było true to by cały czas działalo w tle chyba
    //open new tab
    const page = await browser.newPage();
    // https://pl.indeed.com/jobs?q={skill}&l=Krak%C3%B3w
    await page.goto(`https://pl.indeed.com/jobs?q=${skill}&l=Krak%C3%B3w`, {
        timeout: 0,
        waitUntil: 'networkidle0'
    });
    
    const jobData = await page.evaluate(async (data) => {
        const items = document.querySelectorAll('td.resultContent');
        items.forEach((item, index) => {
            const title = item.querySelector('h2.jobTitle>a')?.innerText;
            const link = item.querySelector('h2.jobTitle>a')?.href;
            const salary = item.querySelector('div.metadata.salary-snippet-container > div')?.innerText;
            const companyName = item.querySelector('span.companyName')?.innerText;
        
        if(salary === null) {
            salary = "not defined"
        }
        data.list.push({
            title,
            salary,
            companyName,
            link
        })
        })
    });
    return data;
    browser.close();
};

module.exports = main;