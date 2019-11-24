import { pool } from 'db';

const get = (req, res) => {
  const userId = req.params.id;

  if (parseInt(userId, 10)) {
    pool.query(
      `SELECT
        person.id,
        person.email,
        person.first_name as "firstName",
        person.last_name as "lastName",
        (
          SELECT
          json_build_object(
            'passed', COALESCE(json_agg(passed), '{}'),
            'subscribed', COALESCE(json_agg(subscribed), '{}')
          ) AS classes
          FROM (
            SELECT class.id, class.name FROM class
              INNER JOIN student ON person.id = student.person_id
              INNER JOIN class_student ON class_student.student_id = student.id AND class.id = class_student.class_id
                WHERE class_student.has_passed IS true AND person.id = $1
          ) as passed
        )
        from person,
        (
          SELECT class.id, class.name FROM class
          INNER JOIN class_student ON class_student.class_id = class.id
          INNER JOIN student ON class_student.student_id = student.id
          INNER JOIN person ON person.id = class_student.student_id
          WHERE class_student.has_subscribed IS true AND person.id = $1
        ) as subscribed
        where person.id = $1
        group by person.id`,
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
