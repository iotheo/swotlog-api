import { pool } from 'db';

const get = (req, res) => {
  const {
    id: tutorId,
  } = req.params;

  if (parseInt(tutorId, 10)) {
    pool.query(
      'SELECT *, tutor.specialty from person\
      INNER JOIN tutor ON\
      person.id = tutor.person_id\
      AND person.id = $1\
      LIMIT 1',
      [tutorId],
      (error, results) => {
        if (error) {
          throw error;
        }

        if (!results.rows.length) {
          res.status(404).send('tutor not found :(');

          return;
        }

        res.status(200).send(results.rows);
      },
    );

    return;
  }

  pool.query(
    'SELECT *, tutor.specialty from person\
    INNER JOIN tutor ON\
    person.id = tutor.person_id',
    (error, results) => {
      if (error) {
        throw error;
      }

      if (!results.rows.length) {
        res.status(404).send('Tutor not found :(');
      }

      res.status(200).send(results.rows);
    },
  );
};

export default get;
