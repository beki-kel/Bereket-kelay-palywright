import { test, expect } from '@playwright/test';

test('BBC Weather Scraper: Paginating through Today and the Next 3 Days', async ({ page }) => {
  console.log('Starting BBC Weather Scraper');
  await page.goto('https://www.bbc.com/weather');

  // Search for a city
  await page.waitForSelector('input[placeholder="Enter a city"]');
  await page.fill('input[placeholder="Enter a city"]', 'Addis Ababa');
  await page.press('button[title="Search for a location"]', 'Enter');
  await page.waitForSelector('li[role="option"]');
  await page.click('li[role="option"]');
  await page.waitForSelector('.wr-day', { timeout: 5000 });

  let hasNextPage = true;
  let dayCount = 0;

  while (hasNextPage && dayCount < 4) { // Limit to today + next 3 days
    const dayTitle = await page.textContent('.wr-day__title');
    const temperature = await page.textContent('.wr-day__temperature');
    const description = await page.textContent('.wr-day__weather-type-description');

    console.log(`Weather Information for ${dayTitle}: ${temperature}, ${description}`);

    // Check if there's a "Next" button or link to navigate to the next day's weather
    const nextPageLink = await page.$('.wr-time-slot-primary__icon--next');
    if (nextPageLink) {
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
        nextPageLink.click(),
      ]);
      dayCount++;
    } else {
      hasNextPage = false;
    }
  }
});
