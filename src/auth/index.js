import { pool } from 'db';
import bcrypt from 'bcrypt';

const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

function initializeAuth(passport) {
  passport.use(new LocalStrategy(
    {
      usernameField: 'email',
    },
    function authUser(email, password, done) {
      pool.connect((err, client, _done) => {
        if (err) throw err;

        client.query(
          'SELECT * from person\
          WHERE email = $1 LIMIT 1',
          [email],
          /*
            Returning done(null, false) for the case passwords didn't match
            is redundant, since we do that in the password matching process
          */
          /* eslint-disable-next-line */
          (error, results) => {
            if (error) throw error;


            if (!results.rowCount) {
              _done();

              return done(null, false);
            }

            const { password: hashedPassword } = results.rows[0];

            bcrypt.compare(password, hashedPassword, (_err, passwordsMatched) => {
              if (_err) throw _err;

              if (passwordsMatched) {
                const user = results.rows[0];

                _done();

                return done(null, {
                  id: user.id,
                  firstName: user.first_name,
                  lastName: user.last_name,
                  dateOfBirth: user.date_of_birth,
                  passed: [], // TODO,
                  subscribed: [], // TODO
                });
              }

              // if the user is found but wrong credentials are given
              _done();

              return done(null, false);
            });
          }
        );
      });
    }
  ));

  passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_TOKEN,
  },
  function authUser(jwtPayload, done) {
    pool.query(
      `SELECT * FROM person WHERE id = $1 LIMIT 1`,
      [jwtPayload.id],
      (err, results) => {
        if (err) throw err;

        if (!results.rowCount) {
          return done(null, false);
        }

        done(null, jwtPayload);
      }
    );
  }
  ));
}

export default initializeAuth;
