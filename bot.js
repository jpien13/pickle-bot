const currentDate = new Date();


const dateAWeekFromNow = new Date(currentDate);
dateAWeekFromNow.setDate(currentDate.getDate() + 7);


const dayNumberAWeekFromNow = dateAWeekFromNow.getDate();

console.log(`Day number a week from now: ${dayNumberAWeekFromNow}`);

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

async function clickLogIn(page) {
    const buttonSelector = '.btn-icon-text'; 
    await page.waitForSelector(buttonSelector, { visible: true });
    await page.click(buttonSelector); 
}

async function clickNextWeekButton(page) {
    const buttonSelector = '.btn.planner-date-btn.planner-date-btn-next';

    try {
        await page.waitForSelector(buttonSelector, { visible: true });
        await page.waitForFunction(
            selector => {
                const btn = document.querySelector(selector);
                return btn && !btn.disabled && getComputedStyle(btn).pointerEvents !== 'none';
            },
            {},
            buttonSelector
        );

        // Use JavaScript click if the standard click doesn't work
        await page.evaluate(selector => {
            document.querySelector(selector).click();
        }, buttonSelector);

    } catch (error) {
        console.error("Error clicking 'Next Week' button:", error);
    }
}



async function selectDate(page, targetDate) {
    const targetDayNumber = targetDate.getDate();
    try {
        // Wait for the date elements to be loaded and visible
        await page.waitForSelector('.planner-date-number', { visible: true });

        // Find and click the target date element
        await page.$$eval('.planner-date-number', (elements, targetDayNumber) => {
            const targetElement = elements.find(element => {
                const dayNumber = parseInt(element.textContent.trim(), 10);
                return dayNumber === targetDayNumber;
            });
            if (targetElement && !targetElement.disabled && getComputedStyle(targetElement).pointerEvents !== 'none') {
                targetElement.click();
            }
        }, targetDayNumber);
    } catch (error) {
        console.error("Error selecting date:", error);
    }
}


async function main() {
    try {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        const targetDate = dayNumberAWeekFromNow;
        await page.goto(target, { waitUntil: 'networkidle2' });
        await ClicklogIn(page);
        await fillUsername(page);
        await fillPassword(page);
        await clickLogIn(page);
        await clickNextWeekButton(page);
        await selectDate(page, targetDate);
    } catch (error) {
        console.error('Error in main:', error);
    }
}

main();
