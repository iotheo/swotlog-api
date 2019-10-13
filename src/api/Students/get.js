import { pool } from 'db';

const get = (req, res) => {
  const {
    id: studentId,
  } = req.params;

  if (parseInt(studentId, 10)) {
    pool.query(
      'SELECT *, student.admission from person\
      INNER JOIN student ON\
      person.id = student.person_id\
      AND person.id = $1\
      LIMIT 1',
      [studentId],
      (error, results) => {
        if (error) {
          throw error;
        }

        if (!results.rows.length) {
          res.status(404).send('Student not found :(');

          return;
        }

        res.status(200).send(results.rows);
      },
    );

    return;
  }

  pool.query(
    'SELECT *, student.admission from person\
    INNER JOIN student ON\
    person.id = student.person_id',
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
