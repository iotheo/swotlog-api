import { pool } from 'db';

const get = (req, res) => {
  const userId = req.params.id;

  if (parseInt(userId, 10)) {
    pool.query(
      'SELECT * FROM person,\
        (\
          SELECT json_agg(to_json(fields)) AS posts\
          from (\
          select id, content, timestamp FROM post WHERE person_id = $1\
          ) fields\
        ) AS posts\
      WHERE person.id = $1 LIMIT 1',
      [userId],
      (error, results) => {
        if (error) {
          throw error;
        }

        if (!results.rows.length) {
          res.status(404).send('User not found :((');

          return;
        }

        res.status(200).json(results.rows[0]);
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
