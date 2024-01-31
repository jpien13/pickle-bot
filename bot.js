const puppeteer = require("puppeteer");

const target = 'https://my.lifetime.life/clubs/nj/berkeley-heights/resource-booking.html?sport=Pickleball%3A+Indoor&clubId=188&date=2024-01-31&startTime=-1&duration=60&hideModal=true';

async function ClicklogIn(page) {
    await page.$eval('span.ico-user.icon-adjust-horiz', elem => elem.click());
    await page.evaluate(() => {
        const loginLink = document.querySelector('a.js-login-link.btn.btn-primary.btn-sm.btn-block');
        if (loginLink) {
            loginLink.click();
        }
    });
}

async function fillUsername(page) {
    const usernameSelector = '#account-username'; 
    await page.waitForSelector(usernameSelector); 
    await page.type(usernameSelector, 'berkeleygirl');  
}

async function fillPassword(page) {
    const usernameSelector = '#account-password';
    await page.waitForSelector(usernameSelector); 
    await page.type(usernameSelector, 'JanJu1328'); 
}

async function clickButton(page) {
    const buttonSelector = '.btn-icon-text'; 
    await page.waitForSelector(buttonSelector, { visible: true });
    await page.click(buttonSelector); 
}


async function main() {
    try {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.goto(target, { waitUntil: 'networkidle2' });
        await ClicklogIn(page);
        await fillUsername(page);
        await fillPassword(page);
        await clickButton(page);
    } catch (error) {
        console.error('Error in main:', error);
    }
}

main();
