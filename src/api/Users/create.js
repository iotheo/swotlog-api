import { pool } from 'db';
import bcrypt from 'bcrypt';

const create = (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
  } = req.body;

  pool.connect((err, client, done) => {
    if (err) throw err;

    if (!email || !password) {
      done();

      return res.status(400).send('Required field is missing.');
    }

    if (typeof password !== 'string' || password.length <= 4) {
      done();

      return res.status(400).json({
        error: 'Password length should be at least 4 characters',
      });
    }

    client.query(
      'SELECT * from person\
      WHERE email = $1',
      [email],
      (error, results) => {
        if (error) throw error;

        // Validation check for user
        if (results.rowCount) {
          res.status(409).send('User already exists');
          done();

          return;
        }

        bcrypt.hash(password, 10, (_err, hashedPassword) => {
          if (_err) {
            done();

            return res.status(500).json({
              error: 'Something went wrong',
            });
          }

          client.query(
            'INSERT INTO person\
            (first_name, last_name, email, password)\
             VALUES\
             ($1, $2, $3, $4)',
            [
              firstName,
              lastName,
              email,
              hashedPassword
            ], (_error, result) => {
              if (_error) {
                throw _error;
              }
            }
          );
        });

        done();
        res.status(201).send('User signed up');
      }
    );
  });
};

export default create;
