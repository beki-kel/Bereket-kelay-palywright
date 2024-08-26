import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('BBC Weather Multiple context Tests', () => {
  let results: any = {};

  test('Search for Addis Ababa', async ({ page }) => {
    // Open the page
    await page.goto('https://www.bbc.com/weather');
    await page.waitForSelector('input[placeholder="Enter a city"]');
    await page.fill('input[placeholder="Enter a city"]', 'Addis Ababa');
    await page.press('button[title="Search for a location"]', 'Enter');
    await page.waitForSelector('li[role="option"]');
    await page.click('li[role="option"]');
    await page.waitForSelector('.wr-day');
    
    const weatherText = await page.textContent('.wr-day');
    const screenshotPath = path.resolve(__dirname, 'bbc-weather-screenshot-addis-ababa.png');
    const pdfPath = path.resolve(__dirname, 'bbc-weather-report-addis-ababa.pdf');
    
    await page.screenshot({ path: screenshotPath });
    await page.pdf({ path: pdfPath, format: 'A4' });
    
    // Store results for this test
    results['Addis Ababa'] = {
      weather: weatherText,
      screenshot: screenshotPath,
      pdf: pdfPath
    };
  });

  test('Search for London', async ({ page }) => {
    // Open the page
    await page.goto('https://www.bbc.com/weather');
    await page.waitForSelector('input[placeholder="Enter a city"]');
    await page.fill('input[placeholder="Enter a city"]', 'London');
    await page.press('button[title="Search for a location"]', 'Enter');
    await page.waitForSelector('li[role="option"]');
    await page.click('li[role="option"]');
    await page.waitForSelector('.wr-day');
    
    const weatherText = await page.textContent('.wr-day');
    const screenshotPath = path.resolve(__dirname, 'bbc-weather-screenshot-london.png');
    const pdfPath = path.resolve(__dirname, 'bbc-weather-report-london.pdf');
    
    await page.screenshot({ path: screenshotPath });
    await page.pdf({ path: pdfPath, format: 'A4' });
    
    // Store results for this test
    results['London'] = {
      weather: weatherText,
      screenshot: screenshotPath,
      pdf: pdfPath
    };
  });

  test.afterAll(() => {
    // Output results
    console.log('Test Results:', JSON.stringify(results, null, 2));
    
    // Optionally, write results to a file
    fs.writeFileSync('test-results.json', JSON.stringify(results, null, 2));
  });
});