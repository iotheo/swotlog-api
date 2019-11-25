import { pool } from 'db';

const get = (req, res) => {
  const {
    token,
    id,
  } = res.locals;

  const userId = req.params.id || id;
  console.log('to id', userId);

  if (parseInt(userId, 10)) {
    pool.query(
      `SELECT
        person.id,
        person.email,
        person.first_name as "firstName",
        person.last_name as "lastName"
        FROM person WHERE person.id = $1`,
      [userId],
      (error, results) => {
        if (error) {
          throw error;
        }

        if (!results.rowCount) {
          res.status(404).json({
            message: 'User not found',
          });

          return;
        }

        res.status(200).json({
          ...results.rows[0],
          token,
        });
      }
    );

    return;
  }

  pool.query('SELECT * FROM person', (error, results) => {
    if (error) {
      throw error;
    }

    res.status(200).json(results.rows);
  });
};

export default get;
