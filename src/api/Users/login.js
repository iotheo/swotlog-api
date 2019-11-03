import { pool } from 'db';
import auth from '../../auth';

const login = (req, res) => {
  const {
    email,
    password,
  } = req.body;
  console.table([req.body]);

  pool.query(
    'SELECT * from person\
    WHERE email = $1',
    [email],
    (error, results) => {
      if (error) {
        throw error;
      }

      // auth(results.rows[0]);
      // console.log(results.rows[0]);
      // if (!results.rows.length) {
      //   res.status(404).send('Tutor not found :(');
      // }

      res.status(200).send(results.rows[0]);
    }
  );
};

export default login;
