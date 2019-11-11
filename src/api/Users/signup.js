import { pool } from 'db';
import bcrypt from 'bcrypt';

const signup = (req, res) => {
  const {
    first_name: firstName,
    last_name: lastName,
    email,
    password,
    registration,
    date_of_birth: dateOfBirth,
  } = req.body;

  pool.connect((err, client, done) => {
    if (err) throw err;

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
            res.status(500).send('Something happened');
            done();
            return;
          }

          client.query(
            'INSERT INTO person\
            (first_name, last_name, email, password, registration, date_of_birth)\
             VALUES\
             ($1, $2, $3, $4, $5, $6)',
            [
              firstName,
              lastName,
              email,
              hashedPassword,
              registration,
              dateOfBirth
            ], (_error, result) => {
              if (_error) {
                res.status(500).send(error);
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

export default signup;
