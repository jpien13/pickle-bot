const puppeteer = require("puppeteer");

const target = 'https://my.lifetime.life/clubs/nj/berkeley-heights/resource-booking.html?sport=Pickleball%3A+Indoor&clubId=188&date=2024-01-31&startTime=-1&duration=60&hideModal=true'

async function initBrowser() {
    try {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.goto(target, { waitUntil: 'networkidle2' });
        return page;
    } catch (error) {
        console.error("Error in initBrowser:", error);
        throw error;
    }
}

async function logIn(page) {
    await page.$eval('span.ico-user.icon-adjust-horiz', elem => elem.click());
    await page.evaluate(() => {
        const loginLink = document.querySelector('a.js-login-link.btn.btn-primary.btn-sm.btn-block');
        if (loginLink) {
            loginLink.click();
        }
    });

}


async function checkout() {
    const page = await initBrowser();
    await logIn(page)
}

checkout().catch(err => console.error(err));
