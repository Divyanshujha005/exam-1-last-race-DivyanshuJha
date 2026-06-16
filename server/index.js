
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import session from 'express-session';
import passport from './passport.js';

import * as usersDao from './dao/users-dao.js';
import * as networkDao from './dao/network-dao.js';
import * as gamesDao from './dao/games-dao.js';

const app = express();
const PORT = 3001;

app.use(morgan('dev'));

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true
  })
);

app.use(express.json());

app.use(
  session({
    secret: 'last-race-super-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());

/* -----------------------------
   AUTH HELPERS
----------------------------- */

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.status(401).json({
    error: 'Not authenticated'
  });
}

/* -----------------------------
   SESSION APIs
----------------------------- */

// Current session

app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({
      error: 'No active session'
    });
  }
});

// Login

app.post('/api/sessions', (req, res, next) => {
  passport.authenticate(
    'local',
    (err, user, info) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.status(401).json({
          error:
            info?.message ||
            'Incorrect username or password'
        });
      }

      req.login(user, (err) => {
        if (err) {
          return next(err);
        }

        return res.json(user);
      });
    }
  )(req, res, next);
});

// Logout

app.delete(
  '/api/sessions/current',
  (req, res) => {
    req.logout(() => {
      req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.status(200).json({
          message: 'Logged out'
        });
      });
    });
  }
);

/* -----------------------------
   NETWORK APIs
----------------------------- */

// Setup phase (full map)

app.get(
  '/api/network/setup',
  isLoggedIn,
  async (req, res) => {
    try {
      const network =
        await networkDao.getFullNetwork();

      res.json(network);
    } catch (err) {
      console.error(err);

      res.status(500).json({
        error: 'Failed to load network'
      });
    }
  }
);

/* -----------------------------
   GAME APIs
----------------------------- */


// Create game

app.post(
  '/api/games',
  isLoggedIn,
  async (req, res) => {
    try {
      const {
        startStation,
        destinationStation
      } =
        await networkDao.generateStationsForGame();

      const planningData =
        await networkDao.getPlanningData();

      const fullNetwork =
        await networkDao.getFullNetwork();

      res.json({
        startStation,
        destinationStation,

        stations:
          planningData.stations,

        segments:
          planningData.segments,

        connections:
          fullNetwork.connections,

        lines:
          fullNetwork.lines
      });
    } catch (err) {
      console.error(err);

      res.status(500).json({
        error:
          'Failed to create game'
      });
    }
  }
);


// Submit route

app.post(
  '/api/games/submit-route',
  isLoggedIn,
  async (req, res) => {
    try {
      const {
        routeSegments,
        startStationId,
        destinationStationId
      } = req.body;

      if (
        !Array.isArray(routeSegments)
      ) {
        return res.status(400).json({
          error:
            'routeSegments must be an array'
        });
      }

      const validation =
        await gamesDao.validateRoute(
          routeSegments,
          startStationId,
          destinationStationId
        );

      // INVALID ROUTE

      if (!validation.valid) {
        const gameId =
          await gamesDao.saveGame({
            userId: req.user.id,
            startStationId,
            destinationStationId,
            submittedRoute:
              routeSegments,
            validRoute: false,
            finalScore: 0
          });

        return res.json({
          valid: false,
          gameId,
          executionSteps: [],
          finalScore: 0
        });
      }

      // EXECUTION

      const execution =
        await gamesDao.executeJourney(
          validation.routeSteps
        );

      const gameId =
        await gamesDao.saveGame({
          userId: req.user.id,
          startStationId,
          destinationStationId,
          submittedRoute:
            routeSegments,
          validRoute: true,
          finalScore:
            execution.finalScore
        });

      await gamesDao.saveGameSteps(
        gameId,
        execution.executionSteps
      );

      res.json({
        valid: true,
        gameId,
        executionSteps:
          execution.executionSteps,
        finalScore:
          execution.finalScore
      });
    } catch (err) {
      console.error(err);

      res.status(500).json({
        error:
          'Failed to submit route'
      });
    }
  }
);

/* -----------------------------
   RANKING API
----------------------------- */

app.get(
  '/api/ranking',
  isLoggedIn,
  async (req, res) => {
    try {
      const ranking =
        await usersDao.getRanking();

      res.json(ranking);
    } catch (err) {
      console.error(err);

      res.status(500).json({
        error:
          'Failed to load ranking'
      });
    }
  }
);

/* -----------------------------
   404
----------------------------- */

app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found'
  });
});

/* -----------------------------
   START SERVER
----------------------------- */

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});
