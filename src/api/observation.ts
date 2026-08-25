import { APIRequestContext } from '@playwright/test';

const API_BASE = 'https://api.inaturalist.org/v1';

export async function getObservation(
  request: APIRequestContext,
  observationId: number,
) {
  const response = await request.get(`${API_BASE}/observations/${observationId}`);

  const body = await response.json();
  return { status: response.status(), body };
}

export async function deleteObservation(
  request: APIRequestContext,
  observationId: number,
  token: string,
) {
  const response = await request.delete(`${API_BASE}/observations/${observationId}`, {
    headers: {
      Authorization: token,
    },
  });

  const body = await response.json();
  return { status: response.status(), body };
}
