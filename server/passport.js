
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import crypto from 'crypto';

import * as usersDao from './dao/users-dao.js';

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await usersDao.getUserByUsername(username);

      if (!user) {
        return done(null, false, {
          message: 'Incorrect username or password'
        });
      }

      crypto.scrypt(password, user.salt, 32, (err, hashedPassword) => {
        if (err) return done(err);

        const storedHash = Buffer.from(user.password_hash, 'hex');

        if (!crypto.timingSafeEqual(storedHash, hashedPassword)) {
          return done(null, false, {
            message: 'Incorrect username or password'
          });
        }

        return done(null, {
          id: user.id,
          username: user.username
        });
      });
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await usersDao.getUserById(id);

    if (!user) {
      return done(null, false);
    }

    done(null, {
      id: user.id,
      username: user.username
    });
  } catch (err) {
    done(err);
  }
});

export default passport;
