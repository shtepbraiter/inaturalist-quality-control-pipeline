import { test, expect, APIRequestContext } from '@playwright/test';

async function isAlmaty(request: APIRequestContext, location: string): Promise<boolean> {
  const [lat, lon] = location.split(',').map(Number);
  const delta = 0.1;
  const response = await request.get(
    `https://api.inaturalist.org/v1/places/nearby?nelat=${lat + delta}&nelng=${lon + delta}&swlat=${lat - delta}&swlng=${lon - delta}`
  );
  const body = await response.json();
  const places = [...body.results.standard, ...body.results.community];
  return places.some((p: { display_name: string }) => p.display_name.toLowerCase().includes('almaty'));
}

test.describe('User Observations API', () => {
  test('GET /observations by user should return 30 observations by default', async ({ request }) => {
    const response = await request.get(
      'https://api.inaturalist.org/v1/observations?user_id=shtepbraiter'
    );

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.results).toBeDefined();
    expect(Array.isArray(body.results)).toBe(true);
    expect(body.results.length).toBe(30);
  });

  test('GET /observations by user with per_page=10 should return 10 observations', async ({ request }) => {
    const response = await request.get(
      'https://api.inaturalist.org/v1/observations?user_id=shtepbraiter&per_page=10'
    );

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.results).toBeDefined();
    expect(body.results.length).toBe(10);
  });

  test('GET /observations by city name Almaty should return observations with location in Almaty', async ({ request }) => {
    const response = await request.get(
      'https://api.inaturalist.org/v1/observations?q=Almaty&per_page=10'
    );

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.results.length).toBe(10);

    const idx = Math.floor(Math.random() * 10);
    const obs = body.results[idx];
    expect(obs.place_guess.toLowerCase()).toContain('almaty');
    expect(await isAlmaty(request, obs.location)).toBe(true);
  });

  test('GET /observations by taxon snakes should return observations with snake taxon', async ({ request }) => {
    const response = await request.get(
      'https://api.inaturalist.org/v1/observations?taxon_id=85553&per_page=10'
    );

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.results.length).toBe(10);

    const idx = Math.floor(Math.random() * 10);
    const obs = body.results[idx];
    expect(obs.taxon.ancestor_ids).toContain(85553);
  });

  test('GET /observations by city Almaty and taxon snakes should return observations in Almaty with snake taxon', async ({ request }) => {
    const response = await request.get(
      'https://api.inaturalist.org/v1/observations?place_id=10941&taxon_id=85553&per_page=10'
    );

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.results.length).toBe(10);

    const idx = Math.floor(Math.random() * 10);
    const obs = body.results[idx];
    expect(typeof obs.location).toBe('string');
    expect(await isAlmaty(request, obs.location)).toBe(true);
    expect(obs.taxon.ancestor_ids).toContain(85553);
  });
});
