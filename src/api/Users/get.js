import { pool } from 'db';

const get = (req, res) => {
  const userId = req.params.id;

  if (parseInt(userId, 10)) {
    pool.query('SELECT * FROM person where id = $1 LIMIT 1', [userId], (error, results) => {
      if (error) {
        throw error;
      }

      if (!results.rows.length) {
        res.status(404).send('Not found. Bruh');

        return;
      }

      res.status(200).json(results.rows);
    });

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
