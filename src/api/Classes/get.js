import { pool } from 'db';

const get = (req, res) => {
  const {
    id: classId,
  } = req.params;

  if (parseInt(classId, 10)) {
    pool.query(
      'SELECT students, class from class where id = $1 LIMIT 1 ',
      [classId],
      (error, results) => {
        if (error) {
          throw error;
        }

        if (!results.rows.length) {
          res.status(404).send('Class not found :(');

          return;
        }

        res.status(200).send(results.rows[0]);
      }
    );

    return;
  }

  pool.query(
    'SELECT * from class, (\
      SELECT array_to_json(array_agg(to_json(fields)))\
          from (\
            select * from student\
          ) fields\
    ) as data',
    (error, results) => {
      if (error) {
        throw error;
      }

      if (!results.rows.length) {
        res.status(404).send('Student not found :(');
      }

      res.status(200).send(results.rows);
    }
  );
};

export default get;
