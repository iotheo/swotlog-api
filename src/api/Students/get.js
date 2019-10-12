import { pool } from 'db';

const get = (req, res) => {
  const {
    id: studentId,
  } = req.params;

  pool.query(
    'SELECT * from student where id = $1',
    [studentId],
    (error, results) => {
      if (error) {
        throw error;
      }

      if (!results.rows.length) {
        res.status(404).send('Student not found :(');
      }

      res.status(200).send(results.rows);
    },
  );
};

export default get;
