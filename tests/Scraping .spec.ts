const { test, expect } = require('@playwright/test');

test('Scrape Weather Data for Addis Ababa', async ({ page }) => {
  console.log('Playwright Scraping Example: Extracting Weather Data for Addis Ababa');
  await page.goto('https://www.bbc.com/weather');

  // Search for Addis Ababa
  await page.fill('input[placeholder="Enter a city"]', 'Addis Ababa');
  await page.press('input[placeholder="Enter a city"]', 'Enter');
  await page.waitForSelector('li[role="option"]', { timeout: 5000 });
  await page.click('li[role="option"]');
  await page.waitForSelector('.wr-day', { timeout: 5000 });

  // Extract weather data
  const weatherData = await page.evaluate(() => {
    const extractWeatherData = () => {
      const weatherElements = document.querySelectorAll('.wr-day');
      const data = [];

      weatherElements.forEach(element => {
        const dayTitle = element.querySelector('.wr-day__title')?.textContent.trim() || 'No title';
        const temperature = element.querySelector('.wr-day__temperature')?.textContent.trim() || 'No temperature';
        const description = element.querySelector('.wr-day__weather-type-description')?.textContent.trim() || 'No description';
        
        data.push({ dayTitle, temperature, description });
      });
      return data;
    };
    return extractWeatherData();
  });

  console.log('Weather Data for Addis Ababa:');
  weatherData.forEach(day => {
    console.log(`Day: ${day.dayTitle}`);
    console.log(`Temperature: ${day.temperature}`);
    console.log(`Description: ${day.description}`);
    console.log('-------------------');
  });

  // Validate that weather data is extracted
  expect(weatherData).toBeTruthy();
  expect(weatherData.length).toBeGreaterThan(0);
});
