import { pool } from 'db';
import bcrypt from 'bcrypt';

const LocalStrategy = require('passport-local').Strategy;

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
                _done();

                return done(null, results.rows[0]);
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

  passport.serializeUser((user, done) => {
    done(null, user.email);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });
}

export default initializeAuth;
