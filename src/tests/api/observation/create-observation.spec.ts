import { test, expect } from '@playwright/test';
import { deleteObservation, getObservation } from '../../../api/observation';

test.describe('Observations API', () => {
  let observationId: number | undefined;

  const token = process.env.INATURALIST_API_TOKEN;

  test.afterEach(async ({ request }) => {
    if (observationId && token) {
      const { status } = await deleteObservation(request, observationId, token);
      observationId = undefined;
    }
  });

  test('POST /observations should create a new observation', async ({ request }) => {
    if (!token) {
      throw new Error('INATURALIST_API_TOKEN environment variable is required');
    }

    const createResponse = await request.post('./observations', {
      headers: {
        Authorization: token,
      },
      data: {
        observation: {
          species_guess: 'Elaphe dione',
          observed_on_string: '2026-08-24 00:00:00',  //observed_on_string used in inaturalist web app. observed_on don't saved in DB
          latitude: 43.32018,
          longitude: 76.86679,
        },
      },
    });

    const createBody = await createResponse.json();
    observationId = createBody.id;
    expect(createResponse.status()).toBe(200);

    const { status, body } = await getObservation(request, observationId);

    expect(status).toBe(200);
    expect(body.results[0].species_guess).toBe('Elaphe dione');
    expect(body.results[0].observed_on_string).toBe('2026-08-24 00:00:00');
    expect(body.results[0].geojson.coordinates).toEqual([76.86679, 43.32018]);
  });

  test('POST /observations with empty fields should return 500', async ({ request }) => {
    if (!token) {
      throw new Error('INATURALIST_API_TOKEN environment variable is required');
    }

    const response = await request.post('./observations', {
      headers: {
        Authorization: token,
      },
      data: {
        observation: {},
      },
    });

    const body = await response.json();

    expect(response.status()).toBe(500);
    expect(body).toHaveProperty('error');
  });

  test('POST /observations with a single field should succeed', async ({ request }) => {
    if (!token) {
      throw new Error('INATURALIST_API_TOKEN environment variable is required');
    }

    const response = await request.post('./observations', {
      headers: {
        Authorization: token,
      },
      data: {
        observation: {
          species_guess: 'Elaphe dione',
        },
      },
    });

    const body = await response.json();
    observationId = body.id;

    expect(response.status()).toBe(200);
    expect(body).not.toHaveProperty('error');

    
  });

  test('POST /observations with random photo_license should succeed', async ({ request }) => {
    if (!token) {
      throw new Error('INATURALIST_API_TOKEN environment variable is required');
    }

    const response = await request.post('./observations', {
      headers: {
        Authorization: token,
      },
      data: {
        observation: {
          photo_license: "test",
        },
      },
    });

    const body = await response.json();
    observationId = body.id;

    expect(response.status()).toBe(200); //inaturalist have no field's validation
  });
});
