
const SERVER_URL = 'http://localhost:3001/api';

/* -----------------------------
   AUTH
----------------------------- */

export async function logIn(credentials) {
  const response = await fetch(
    `${SERVER_URL}/sessions`,
    {
      method: 'POST',
      headers: {
        'Content-Type':
          'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(
        credentials
      )
    }
  );

  const user =
    await response.json();

  if (!response.ok) {
    throw user;
  }

  return user;
}

export async function getUserInfo() {
  const response = await fetch(
    `${SERVER_URL}/sessions/current`,
    {
      credentials: 'include'
    }
  );

  const user =
    await response.json();

  if (!response.ok) {
    throw user;
  }

  return user;
}

export async function logOut() {
  const response = await fetch(
    `${SERVER_URL}/sessions/current`,
    {
      method: 'DELETE',
      credentials: 'include'
    }
  );

  if (!response.ok) {
    throw new Error(
      'Logout failed'
    );
  }
}

/* -----------------------------
   NETWORK
----------------------------- */

export async function getSetupMap() {
  const response = await fetch(
    `${SERVER_URL}/network/setup`,
    {
      credentials: 'include'
    }
  );

  const data =
    await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}

/* -----------------------------
   GAME
----------------------------- */

export async function startGame() {
  const response = await fetch(
    `${SERVER_URL}/games`,
    {
      method: 'POST',
      credentials: 'include'
    }
  );

  const data =
    await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}

export async function submitRoute(
  routeSegments,
  startStationId,
  destinationStationId
) {
  const response = await fetch(
    `${SERVER_URL}/games/submit-route`,
    {
      method: 'POST',
      headers: {
        'Content-Type':
          'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        routeSegments,
        startStationId,
        destinationStationId
      })
    }
  );

  const data =
    await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}

/* -----------------------------
   RANKING
----------------------------- */

export async function getRanking() {
  const response = await fetch(
    `${SERVER_URL}/ranking`,
    {
      credentials: 'include'
    }
  );

  const ranking =
    await response.json();

  if (!response.ok) {
    throw ranking;
  }

  return ranking;
}
