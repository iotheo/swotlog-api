import { pool } from 'db';

/* Delete is a reserved word, so let's name it del */
const del = (req, res) => {
  const {
    id: userId,
  } = req.params;

  pool.query(
    'DELETE from person where id = $1 LIMIT 1',
    [userId],
    (error, results) => {
      if (error) {
        res.status(400).send(error);

        return;
      }

      if (!results.rowCount) {
        res.status(404).send('Not found :(');

        return;
      }

      res.status(200).send(`User with ID:${userId} deleted successfully`);
    }
  );
};

export default del;
