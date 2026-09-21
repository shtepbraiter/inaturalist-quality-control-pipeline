import { APIRequestContext } from '@playwright/test';

export async function createObservation(request: APIRequestContext, token: string) {
  const response = await request.post(`./observations`, {
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
  const response = await request.get(`./observations/${observationId}`);

  const body = await response.json();
  return { status: response.status(), body };
}

export async function deleteObservation(
  request: APIRequestContext,
  observationId: number,
  token: string,
) {
  const response = await request.delete(`./observations/${observationId}`, {
    headers: {
      Authorization: token,
    },
  });

  let body: unknown;
  const text = await response.text();
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }
  return { status: response.status(), body };
}
