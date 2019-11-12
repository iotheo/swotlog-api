import { pool } from 'db';

/* Delete is a reserved word, so let's name it del */
const del = (req, res) => {
  const {
    id,
  } = req.body;

  const classId = parseInt(id, 10);

  pool.query(
    'DELETE FROM class WHERE id = $1',
    [classId],
    (err, results) => {
      if (err) throw err;

      if (!results.rowCount) {
        return res.status(404).send('Class not found');
      }

      return res.status(200).send(`Class with ID: ${classId} deleted successfully`);
    }
  );
};

export default del;
