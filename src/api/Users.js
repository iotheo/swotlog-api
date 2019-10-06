import { pool } from '../db';

const get = (req, res) => {
  if (parseInt(req.params.id, 10)) {
    res.status(200).send('easter egg');
    return;
  }

  pool.query('SELECT * FROM person', (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
};

export {
  get,
};
