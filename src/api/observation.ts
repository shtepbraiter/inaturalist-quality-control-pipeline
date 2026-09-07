import { APIRequestContext } from '@playwright/test';

const API_BASE = 'https://api.inaturalist.org/v1';

export async function createObservation(request: APIRequestContext, token: string) {
  const response = await request.post(`${API_BASE}/observations`, {
    headers: {
      Authorization: token,
    },
    data: {
      observation: {
        species_guess: 'Elaphe dione',
        observed_on_string: '2026-08-24 00:00:00',
        latitude: 43.32018,
        longitude: 76.86679,
      },
    },
  });

  const body = await response.json();
  return { status: response.status(), body };
}

export async function getObservation(
  request: APIRequestContext,
  observationId: number,
) {
  const response = await request.get(`${API_BASE}/observations/${observationId}`);

  const body = await response.json();
  return { status: response.status(), body };
}

export async function updateObservation(
  request: APIRequestContext,
  observationId: number,
  payload: { species_guess?: string },
  token: string,
) {
  const response = await request.put(`${API_BASE}/observations/${observationId}`, {
    headers: {
      Authorization: token,
    },
    data: {
      observation: payload,
    },
  });

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

export async function deleteLatestByUser(
  request: APIRequestContext,
  username: string,
  token: string,
) {
  const response = await request.get(
    `${API_BASE}/observations?user_login=${username}&order=desc&order_by=created_at&per_page=1`
  );

  const body = await response.json();
  const observation = body.results[0];
  if (!observation) {
    return { deleted: false, reason: 'no observations found' };
  }

  const latinName = observation.taxon?.name;
  if (latinName !== 'Elaphe dione') {
    return { deleted: false, reason: `species is ${latinName}, not Elaphe dione` };
  }

  const { status } = await deleteObservation(request, observation.id, token);
  return { deleted: status === 200, observationId: observation.id };
}
