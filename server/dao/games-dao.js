import db from '../db.js';

/* EVENTS */

export function getEvents() {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM events`, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

/* SEGMENTS */

export function getConnections() {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT id, station1_id, station2_id
      FROM segments
      `,
      [],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
}

/* LINE TOPOLOGY */

function getLineStations() {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT
        ls.line_id,
        ls.station_id,
        ls.station_order,
        s.is_interchange
      FROM line_stations ls
      JOIN stations s
        ON s.id = ls.station_id
      ORDER BY
        ls.line_id,
        ls.station_order
      `,
      [],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
}

/* VALIDATE ROUTE */

export async function validateRoute(
  routeSegments,
  startStationId,
  destinationStationId
) {
  const segments = await getConnections();
  const lineStations = await getLineStations();

  if (!routeSegments || routeSegments.length === 0) {
    return { valid: false };
  }

  const lineGroups = new Map();
  const interchangeMap = new Map();

  for (const row of lineStations) {
    if (!lineGroups.has(row.line_id)) {
      lineGroups.set(row.line_id, []);
    }

    lineGroups.get(row.line_id).push(row);

    interchangeMap.set(
      row.station_id,
      row.is_interchange === 1
    );
  }

  const segmentLines = new Map();

  for (const [lineId, stations] of lineGroups.entries()) {
    for (let i = 0; i < stations.length - 1; i++) {
      const a = stations[i].station_id;
      const b = stations[i + 1].station_id;

      const key1 = `${a}-${b}`;
      const key2 = `${b}-${a}`;

      if (!segmentLines.has(key1)) {
        segmentLines.set(key1, new Set());
      }

      if (!segmentLines.has(key2)) {
        segmentLines.set(key2, new Set());
      }

      segmentLines.get(key1).add(lineId);
      segmentLines.get(key2).add(lineId);
    }
  }

  let currentStation = startStationId;
  let currentLine = null;

  const usedSegments = new Set();
  const routeSteps = [];

  for (const segmentId of routeSegments) {
    if (usedSegments.has(segmentId)) {
      return { valid: false };
    }

    usedSegments.add(segmentId);

    const segment = segments.find((s) => s.id === segmentId);

    if (!segment) {
      return { valid: false };
    }

    let nextStation = null;

    if (segment.station1_id === currentStation) {
      nextStation = segment.station2_id;
    } else if (segment.station2_id === currentStation) {
      nextStation = segment.station1_id;
    } else {
      return { valid: false };
    }

    const possibleLines =
      segmentLines.get(`${currentStation}-${nextStation}`);

    if (!possibleLines || possibleLines.size === 0) {
      return { valid: false };
    }

    if (currentLine === null) {
      currentLine = [...possibleLines][0];
    } else if (!possibleLines.has(currentLine)) {
      const canSwitch = interchangeMap.get(currentStation);

      if (!canSwitch) {
        return { valid: false };
      }

      currentLine = [...possibleLines][0];
    }

    routeSteps.push({
      from: currentStation,
      to: nextStation,
      line: currentLine
    });

    currentStation = nextStation;
  }

  if (currentStation !== destinationStationId) {
    return { valid: false };
  }

  return {
    valid: true,
    routeSteps
  };
}

/* SAVE GAME */

export async function saveGame({ userId, finalScore }) {
  return new Promise((resolve, reject) => {
    db.run(
      `
      INSERT INTO games (user_id, score)
      VALUES (?, ?)
      `,
      [userId, finalScore],
      function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
}

/* SAVE GAME STEPS */

export async function saveGameSteps(gameId, steps) {
  return Promise.all(
    steps.map(
      (step, index) =>
        new Promise((resolve, reject) => {
          db.run(
            `
            INSERT INTO game_steps (
              game_id,
              step_number,
              from_station,
              to_station,
              event_id
            )
            VALUES (?, ?, ?, ?, ?)
            `,
            [
              gameId,
              index + 1,
              step.from,
              step.to,
              step.event.id
            ],
            (err) => {
              if (err) reject(err);
              else resolve();
            }
          );
        })
    )
  );
}

/* EXECUTE JOURNEY */

export async function executeJourney(routeSteps) {
  const events = await getEvents();

  let coins = 20;
  let transfers = 0;
  let lastLine = null;

  const executionSteps = [];

  for (const step of routeSteps) {
    if (lastLine !== null && step.line !== lastLine) {
      transfers++;
    }

    lastLine = step.line;

    const event =
      events[Math.floor(Math.random() * events.length)];

    coins += event.coins_effect;

    executionSteps.push({
      ...step,
      event,
      coins
    });
  }

  const transferPenalty = transfers * 3;

  return {
    executionSteps,
    finalScore: Math.max(coins - transferPenalty, 0),
    transfers
  };
}