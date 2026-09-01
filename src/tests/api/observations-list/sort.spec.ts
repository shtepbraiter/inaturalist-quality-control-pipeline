import { test, expect } from '@playwright/test';

test.describe('Sort Observations API', () => {
  test('GET /observations sorted by created_at asc should return oldest first', async ({ request }) => {
    const response = await request.get(
      'https://api.inaturalist.org/v1/observations?order_by=created_at&order=asc&per_page=10&place_id=10941'
    );

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.results.length).toBe(30);

    const firstDate = new Date(body.results[0].created_at);
    const lastDate = new Date(body.results[body.results.length - 1].created_at);

    expect(firstDate.getTime()).toBeLessThanOrEqual(lastDate.getTime());
  });
});
