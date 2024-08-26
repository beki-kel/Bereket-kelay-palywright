const { test, expect } = require('@playwright/test');

test.describe('BBC Weather API Mock Test', () => {
  test('mock API response and validate data', async ({ page }) => {
    // Function to mock the API response
    const mockApiResponse = {
      location: {
        name: "London",
        region: "City of London",
        country: "United Kingdom",
        lat: 51.51,
        lon: -0.13,
      },
      current: {
        temp_c: 20.5,
        condition: {
          text: "Partly Cloudy",
          icon: "//cdn.weatherapi.com/weather/64x64/day/116.png",
        },
      },
    };

    // Intercept and fulfill the request with mock data
    await page.route('**/weather/api/location/**', route =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockApiResponse),
      })
    );
    await page.goto('https://www.bbc.com/weather');
    const response = await page.evaluate(async () => {
      const res = await fetch('/weather/api/location/2643743');
      return res.json();
    });
    console.log('Mocked API response:', response);

    // Validate the API response with Playwright's expect assertions
    expect(response.location.name).toBe("London");
    expect(response.current.temp_c).toBe(20.5);
    expect(response.current.condition.text).toBe("Partly Cloudy");
  });

});
