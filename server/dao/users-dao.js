import db from '../db.js';

export function getUserByUsername(
  username
) {
  return new Promise(
    (
      resolve,
      reject
    ) => {
      const sql = `
        SELECT *
        FROM users
        WHERE username = ?
      `;

      db.get(
        sql,
        [username],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        }
      );
    }
  );
}

export function getUserById(
  id
) {
  return new Promise(
    (
      resolve,
      reject
    ) => {
      const sql = `
        SELECT
          id,
          username
        FROM users
        WHERE id = ?
      `;

      db.get(
        sql,
        [id],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        }
      );
    }
  );
}

export function getRanking() {
  return new Promise(
    (
      resolve,
      reject
    ) => {
      const sql = `
        SELECT
          u.username,
          MAX(g.score)
            AS bestScore
        FROM users u
        LEFT JOIN games g
          ON u.id =
             g.user_id
        GROUP BY u.id
        ORDER BY
          bestScore DESC
      `;

      db.all(
        sql,
        [],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    }
  );
}