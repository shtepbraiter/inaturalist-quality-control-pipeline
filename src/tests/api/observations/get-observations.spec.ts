import { test, expect } from '@playwright/test';

test.describe('Observations API', () => {
  test('GET /observations/:id should return a non-empty observation', async ({ request }) => {
    const observationId = 385321901;
    const response = await request.get(`https://api.inaturalist.org/v1/observations/${observationId}`);
    
    expect(response.status()).toBe(200);
    
    const body = await response.json();
    expect(body).not.toBeNull();
  });
});