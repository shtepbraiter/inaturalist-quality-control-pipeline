import { test, expect } from '@playwright/test';
import { deleteObservation } from '../../../api/observation';

test.describe('Observations API', () => {
  let observationId: number | undefined;

  const token = process.env.INATURALIST_API_TOKEN;

  test.afterEach(async ({ request }) => {
    if (observationId) {
      const { status } = await deleteObservation(request, observationId, token);
      console.log(`Deleted observation ${observationId}, status: ${status}`);
      observationId = undefined;
    }
  });

  test('POST /observations should create a new observation', async ({ request }) => {
    if (!token) {
      throw new Error('INATURALIST_API_TOKEN environment variable is required');
    }

    const response = await request.post('https://api.inaturalist.org/v1/observations', {
      headers: {
        Authorization: token,
      },
      data: {
        observation: {
          species_guess: 'Elaphe dione',
          observed_on: '2026-08-24',
          latitude: 43.32018,
          longitude: 76.86679,
        },
      },
    });

    const body = await response.json();
    console.log('Create observation status:', response.status());
    console.log('Create observation body:', JSON.stringify(body, null, 2));

    expect(response.status()).toBe(200);
    expect(body).not.toBeNull();

    observationId = body.id;
  });
});
