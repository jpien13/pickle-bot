const puppeteer = require("puppeteer");


//#############GET RID OF THIS SINCE ALR LOGGED IN ON PROD#####################
async function clickLogInButton(page) {
  await page.$eval("span.ico-user.icon-adjust-horiz", (elem) => elem.click());
  await page.evaluate(() => {
    const loginLink = document.querySelector(
      "a.js-login-link.btn.btn-primary.btn-sm.btn-block"
    );
    if (loginLink) {
      loginLink.click();
    }
  });
}

async function fillUsername(page) {
  const usernameSelector = "#account-username";
  await page.waitForSelector(usernameSelector);
  await page.type(usernameSelector, "berkeleygirl"); // Replace 'berkeleygirl' with the actual username
}

async function fillPassword(page) {
  const passwordSelector = "#account-password";
  await page.waitForSelector(passwordSelector);
  await page.type(passwordSelector, "JanJu1328"); // Replace 'JanJu1328' with the actual password
}

async function clickSubmitLogin(page) {
  const buttonSelector = ".btn-icon-text";
  await page.waitForSelector(buttonSelector, { visible: true });
  await page.click(buttonSelector);
}


async function clickSpecifiedTimeslot(page, desiredTime, desiredCourt) {
  await page.waitForSelector(".timeslot"); // Wait for timeslot elements to load

  const selectorClicked = await page.evaluate(
    (desiredTime, desiredCourt) => {
      const timeslotElements = Array.from(
        document.querySelectorAll(".timeslot")
      );
      const targetElement = timeslotElements.find((element) => {
        const timeText = element
          .querySelector(".timeslot-time")
          .textContent.trim();
        const courtText = element
          .querySelector(".timeslot-resource")
          .textContent.trim();
        return (
          timeText === desiredTime && courtText === `Court ${desiredCourt}`
        );
      });

      if (targetElement) {
        targetElement.click();
        return true;
      }
      return false;
    },
    desiredTime,
    desiredCourt
  );

  if (selectorClicked) {
    console.log(`Clicked on ${desiredTime} Court ${desiredCourt}`);
  } else {
    console.log(`Could not find ${desiredTime} Court ${desiredCourt}`);
  }
}

//#############GET RID OF THIS SINCE ALR LOGGED IN ON PROD#####################

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(
    "https://my.lifetime.life/clubs/nj/berkeley-heights/resource-booking.html",
    { waitUntil: "networkidle2" }
  );

  // Log in
  await clickLogInButton(page);
  await fillUsername(page);
  await fillPassword(page);
  await clickSubmitLogin(page);

  // Wait for navigation after login if necessary
  await page.waitForNavigation({ waitUntil: "networkidle0" });

  // Now proceed with clicking on the desired timeslot
  const desiredTime = "5:00 AM";
  const desiredCourt = 3;
  await clickSpecifiedTimeslot(page, desiredTime, desiredCourt);

  // Add additional logic here as needed
  // await browser.close(); // Uncomment to close the browser after completion
})();
