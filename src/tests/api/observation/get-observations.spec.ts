import { test, expect } from '@playwright/test';

test.describe('Observations API', () => {
  test('GET /observations/:id should return an observation', async ({ request }) => {
    const observationId = 1000000;
    const response = await request.get(`https://api.inaturalist.org/v1/observations/${observationId}`);

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).not.toBeNull();

    const obs = body.results[0];
    expect(obs).toBeDefined();

    expect(typeof obs.species_guess).toBe('string');
    expect(obs.species_guess.length).toBeGreaterThan(0);

    expect(typeof obs.created_at).toBe('string');
    expect(obs.created_at.length).toBeGreaterThan(0);

    expect(typeof obs.user.login).toBe('string');
    expect(obs.user.login.length).toBeGreaterThan(0);

    expect(typeof obs.observed_on_string).toBe('string');
    expect(obs.observed_on_string.length).toBeGreaterThan(0);

    expect(Array.isArray(obs.faves)).toBe(true);
    expect(obs.faves.length).toBeGreaterThan(0);

    expect(Array.isArray(obs.identifications)).toBe(true);
    expect(obs.identifications.length).toBeGreaterThan(0);

    expect(Array.isArray(obs.photos)).toBe(true);
    expect(obs.photos.length).toBeGreaterThan(0);

    expect(typeof obs.geojson).toBe('object');
    expect(obs.geojson).not.toBeNull();
    expect(obs.geojson.type).toBe('Point');
    expect(obs.geojson.coordinates.length).toBe(2);
    expect(typeof obs.geojson.coordinates[0]).toBe('number');
    expect(typeof obs.geojson.coordinates[1]).toBe('number');
  });
});