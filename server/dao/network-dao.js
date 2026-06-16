
import db from '../db.js';

/* ---------------------------------
   STATIONS
--------------------------------- */

export function getStations() {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT *
      FROM stations
      ORDER BY id
      `,
      [],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
}

/* ---------------------------------
   SEGMENTS
--------------------------------- */
export async function getConnections() {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT
        s.id,
        s.station1_id,
        st1.name AS station1_name,
        s.station2_id,
        st2.name AS station2_name
      FROM segments s
      JOIN stations st1 ON st1.id = s.station1_id
      JOIN stations st2 ON st2.id = s.station2_id
      ORDER BY s.id
      `,
      [],
      async (err, segments) => {
        if (err) return reject(err);

        db.all(
          `
          SELECT line_id, station_id, station_order
          FROM line_stations
          ORDER BY line_id, station_order
          `,
          [],
          (err2, lineStations) => {
            if (err2) return reject(err2);

            db.all(`SELECT * FROM lines`, [], (err3, lines) => {
              if (err3) return reject(err3);

              // build line paths
              const lineMap = new Map();

              for (const ls of lineStations) {
                if (!lineMap.has(ls.line_id)) {
                  lineMap.set(ls.line_id, []);
                }
                lineMap.get(ls.line_id).push(ls.station_id);
              }

              // attach line info to segments
              const enriched = segments.map((seg) => {
                const segmentLines = [];

                for (const [lineId, stations] of lineMap.entries()) {
                  for (let i = 0; i < stations.length - 1; i++) {
                    const a = stations[i];
                    const b = stations[i + 1];

                    const match =
                      (a === seg.station1_id && b === seg.station2_id) ||
                      (a === seg.station2_id && b === seg.station1_id);

                    if (match) {
                      const line = lines.find(l => l.id === lineId);

                      segmentLines.push({
                        id: line.id,
                        name: line.name,
                        color: line.color
                      });
                    }
                  }
                }

                return {
                  ...seg,
                  lines: segmentLines
                };
              });

              resolve(enriched);
            });
          }
        );
      }
    );
  });
}
/*
export function getConnections() {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT
        s.id,
        s.station1_id,
        st1.name AS station1_name,
        s.station2_id,
        st2.name AS station2_name
      FROM segments s
      JOIN stations st1
        ON st1.id = s.station1_id
      JOIN stations st2
        ON st2.id = s.station2_id
      ORDER BY s.id
      `,
      [],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
}
*/
/* ---------------------------------
   LINES
--------------------------------- */

export function getLines() {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT *
      FROM lines
      ORDER BY id
      `,
      [],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
}

/* ---------------------------------
   LINE STATIONS
--------------------------------- */

export function getLineStations() {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT
        ls.line_id,
        ls.station_id,
        ls.station_order,
        s.name AS station_name
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

/* ---------------------------------
   BUILD NETWORK
--------------------------------- */

export async function getFullNetwork() {
  const stations =
    await getStations();

  const segments =
    await getConnections();

  const lines =
    await getLines();

  const lineStations =
    await getLineStations();

  return {
    stations,
    segments,
    lines,
    lineStations
  };
}

/* ---------------------------------
   VALID START/DESTINATION
--------------------------------- */

function bfs(
  graph,
  start,
  destination
) {
  const queue = [start];
  const visited =
    new Set([start]);

  while (
    queue.length > 0
  ) {
    const current =
      queue.shift();

    if (
      current ===
      destination
    ) {
      return true;
    }

    const neighbors =
      graph[current] || [];

    for (const next of neighbors) {
      if (
        !visited.has(next)
      ) {
        visited.add(next);
        queue.push(next);
      }
    }
  }

  return false;
}

/* ---------------------------------
   GENERATE GAME
--------------------------------- */

export async function generateStationsForGame() {
  const stations =
    await getStations();

  const segments =
    await getConnections();

  const graph = {};

  segments.forEach(
    (segment) => {
      if (
        !graph[
          segment.station1_id
        ]
      ) {
        graph[
          segment.station1_id
        ] = [];
      }

      if (
        !graph[
          segment.station2_id
        ]
      ) {
        graph[
          segment.station2_id
        ] = [];
      }

      graph[
        segment.station1_id
      ].push(
        segment.station2_id
      );

      graph[
        segment.station2_id
      ].push(
        segment.station1_id
      );
    }
  );

  let startStation;
  let destinationStation;

  do {
    startStation =
      stations[
        Math.floor(
          Math.random() *
            stations.length
        )
      ];

    destinationStation =
      stations[
        Math.floor(
          Math.random() *
            stations.length
        )
      ];
  } while (
    startStation.id ===
      destinationStation.id ||
    !bfs(
      graph,
      startStation.id,
      destinationStation.id
    )
  );

  return {
    startStation,
    destinationStation
  };
}

/* ---------------------------------
   GAME DATA
--------------------------------- */

export async function getPlanningData() {
  const network =
    await getFullNetwork();

  return {
    stations:
      network.stations,
    segments:
      network.segments,
    lines:
      network.lines,
    lineStations:
      network.lineStations
  };
}
