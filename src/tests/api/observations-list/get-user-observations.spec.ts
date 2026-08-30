import { test, expect } from '@playwright/test';

test.describe('User Observations API', () => {
  test('GET /observations by user should return 100 observations', async ({ request }) => {
    const response = await request.get(
      'https://api.inaturalist.org/v1/observations?user_id=shtepbraiter'
    );

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.results).toBeDefined();
    expect(Array.isArray(body.results)).toBe(true);
    expect(body.results.length).toBe(30);
  });

  test('GET /observations by user with per_page=100 should return 100 observations', async ({ request }) => {
    const response = await request.get(
      'https://api.inaturalist.org/v1/observations?user_id=shtepbraiter&per_page=100'
    );

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.results).toBeDefined();
    expect(Array.isArray(body.results)).toBe(true);
    expect(body.results.length).toBe(100);
  });
});
