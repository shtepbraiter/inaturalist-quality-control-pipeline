import { test, expect } from '@playwright/test';
import { createObservation, getObservation } from '../../../api/observation';

test.describe('Delete Observation API', () => {
  let observationId: number | undefined;

  const token = process.env.INATURALIST_API_TOKEN;

  test.afterEach(async ({ request }) => {
    if (observationId && token) {
      await request.delete(`https://api.inaturalist.org/v1/observations/${observationId}`, {
        headers: { Authorization: token },
      });
      observationId = undefined;
    }
  });

  test('DELETE /observations/:id should delete observation', async ({ request }) => {
    if (!token) {
      throw new Error('INATURALIST_API_TOKEN environment variable is required');
    }

    const { status: createStatus, body: createBody } = await createObservation(request, token);
    expect(createStatus).toBe(200);
    observationId = createBody.id;

    const deleteResponse = await request.delete(`https://api.inaturalist.org/v1/observations/${observationId}`, {
      headers: { Authorization: token },
    });
    expect(deleteResponse.status()).toBe(200);

    const { status: getStatus, body: getBody } = await getObservation(request, observationId!);

    expect(getStatus).toBe(200);
    expect(getBody.results.length).toBe(0);
  });
});
