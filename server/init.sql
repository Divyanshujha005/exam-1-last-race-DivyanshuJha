
PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS game_steps;
DROP TABLE IF EXISTS games;
DROP TABLE IF EXISTS line_stations;
DROP TABLE IF EXISTS segments;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS stations;
DROP TABLE IF EXISTS lines;
DROP TABLE IF EXISTS users;

-- USERS

CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL
);

-- STATIONS

CREATE TABLE stations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  is_interchange INTEGER DEFAULT 0
);

-- LINES

CREATE TABLE lines (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  color TEXT NOT NULL
);

-- ORDER OF STATIONS IN EACH LINE

CREATE TABLE line_stations (
  line_id INTEGER NOT NULL,
  station_id INTEGER NOT NULL,
  station_order INTEGER NOT NULL,

  PRIMARY KEY (
    line_id,
    station_id
  ),

  FOREIGN KEY (line_id)
    REFERENCES lines(id),

  FOREIGN KEY (station_id)
    REFERENCES stations(id)
);

-- SEGMENTS

CREATE TABLE segments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  station1_id INTEGER NOT NULL,
  station2_id INTEGER NOT NULL,

  FOREIGN KEY (station1_id)
    REFERENCES stations(id),

  FOREIGN KEY (station2_id)
    REFERENCES stations(id)
);

-- EVENTS

CREATE TABLE events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  description TEXT NOT NULL,
  coins_effect INTEGER NOT NULL
);

-- GAMES

CREATE TABLE games (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  score INTEGER NOT NULL,
  played_at TEXT DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id)
    REFERENCES users(id)
);

-- GAME STEPS

CREATE TABLE game_steps (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  game_id INTEGER NOT NULL,
  step_number INTEGER NOT NULL,
  from_station INTEGER,
  to_station INTEGER,
  event_id INTEGER,

  FOREIGN KEY (game_id)
    REFERENCES games(id),

  FOREIGN KEY (event_id)
    REFERENCES events(id)
);

-- USERS
-- password = password

INSERT INTO users (
  username,
  password_hash,
  salt
)
VALUES
(
  'alice',
  '2a8f2ef3e6d8b4b8716b5a0d3d2d1a40f2d6b2fdbcc75ce89b1b8f94f09d0d56',
  'abc123abc123abc123abc123abc123'
),
(
  'bob',
  '2a8f2ef3e6d8b4b8716b5a0d3d2d1a40f2d6b2fdbcc75ce89b1b8f94f09d0d56',
  'abc123abc123abc123abc123abc123'
),
(
  'charlie',
  '2a8f2ef3e6d8b4b8716b5a0d3d2d1a40f2d6b2fdbcc75ce89b1b8f94f09d0d56',
  'abc123abc123abc123abc123abc123'
);

-- STATIONS (12)

INSERT INTO stations (
  name,
  is_interchange
)
VALUES
('Central',1),
('Oak Square',0),
('East Gate',1),
('Silver Park',0),
('Hill Market',0),
('River End',1),
('West Point',0),
('Museum',0),
('City Hall',1),
('Green Cross',0),
('North End',0),
('Sunset Avenue',0);

-- LINES (4)

INSERT INTO lines (
  name,
  color
)
VALUES
('Red Line','#dc3545'),
('Blue Line','#0d6efd'),
('Green Line','#198754'),
('Yellow Line','#ffc107');

-- LINE STATIONS

INSERT INTO line_stations VALUES
(1,1,1),
(1,2,2),
(1,3,3),
(1,4,4),

(2,1,1),
(2,5,2),
(2,6,3),
(2,7,4),

(3,3,1),
(3,8,2),
(3,9,3),
(3,10,4),

(4,6,1),
(4,9,2),
(4,11,3),
(4,12,4);

-- SEGMENTS

INSERT INTO segments (
  station1_id,
  station2_id
)
VALUES
(1,2),
(2,3),
(3,4),
(1,5),
(5,6),
(6,7),
(3,8),
(8,9),
(9,10),
(6,9),
(9,11),
(11,12);

-- EVENTS (8)

INSERT INTO events (
  description,
  coins_effect
)
VALUES
('Quiet ride',0),
('Wrong platform',-2),
('Helpful passenger',1),
('Train delay',-3),
('Found lost coins',2),
('Shortcut discovered',3),
('Ticket inspection',-1),
('Crowded station',-2);

-- PREVIOUS GAMES

INSERT INTO games (
  user_id,
  score
)
VALUES
(1,18),
(1,24),
(2,15),
(2,21);
