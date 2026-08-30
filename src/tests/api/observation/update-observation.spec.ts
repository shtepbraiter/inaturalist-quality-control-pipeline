import { test, expect } from '@playwright/test';
import {
  createObservation,
  deleteObservation,
  getObservation,
} from '../../../api/observation';

test.describe('Update Observation API', () => {
  let observationId: number | undefined;

  const token = process.env.INATURALIST_API_TOKEN;

  test.afterEach(async ({ request }) => {
    if (observationId) {
      const { status } = await deleteObservation(request, observationId, token);
      console.log(`Deleted observation ${observationId}, status: ${status}`);
      observationId = undefined;
    }
  });

  test('should update species_guess on created observation', async ({ request }) => {
    if (!token) {
      throw new Error('INATURALIST_API_TOKEN environment variable is required');
    }

    const { status: createStatus, body: createBody } = await createObservation(request, token);
    expect(createStatus).toBe(200);
    observationId = createBody.id;

    const updateResponse = await request.put(`https://api.inaturalist.org/v1/observations/${observationId}`, {
      headers: {
        Authorization: token,
      },
      data: {
        observation: {
          species_guess: 'Vipera berus',
        },
      },
    });

    console.log('Update observation status:', updateResponse.status());
    expect(updateResponse.status()).toBe(200);

    const { status: getStatus, body: getBody } = await getObservation(request, observationId);
    console.log('Get observation status:', getStatus);

    expect(getStatus).toBe(200);
    expect(getBody.results[0].species_guess).toBe('Vipera berus');
  });

  test('should update species_guess with non-existent species name', async ({ request }) => {
    if (!token) {
      throw new Error('INATURALIST_API_TOKEN environment variable is required');
    }

    const { status: createStatus, body: createBody } = await createObservation(request, token);
    expect(createStatus).toBe(200);
    observationId = createBody.id;

    const updateResponse = await request.put(`https://api.inaturalist.org/v1/observations/${observationId}`, {
      headers: {
        Authorization: token,
      },
      data: {
        observation: {
          species_guess: 'test name',
        },
      },
    });

    console.log('Update observation status:', updateResponse.status());
    expect(updateResponse.status()).toBe(200);

    const { status: getStatus, body: getBody } = await getObservation(request, observationId);
    console.log('Get observation status:', getStatus);

    expect(getStatus).toBe(200);
    expect(getBody.results[0].species_guess).toBe('test name');
  });
});
