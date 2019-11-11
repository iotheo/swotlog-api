import { pool } from 'db';

const create = (req, res) => {
  const {
    first_name: firstName,
    last_name: lastName,
    email,
    registration,
    date_of_birth: dateOfBirth,
  } = req.body;

  pool.query('INSERT INTO person (first_name, last_name, email, registration,\
   classes, posts, comments, likes, date_of_birth) VALUES\
   ($1, $2, $3, $4, $5)',
  [
    firstName,
    lastName,
    email,
    registration,
    dateOfBirth
  ],
  (error, results) => {
    if (error) {
      res.status(400).send(error);

      return;
    }

    res.status(201).send(`User added with ID: ${JSON.stringify(results)}`);
  });
};

export default create;
