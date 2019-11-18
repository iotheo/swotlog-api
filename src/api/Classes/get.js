import { pool } from 'db';

const get = (req, res) => {
  const {
    id: classId,
  } = req.params;

  if (parseInt(classId, 10)) {
    pool.query(
      `SELECT
        class.*,
        (
          SELECT
            json_build_object(
            'passed', COALESCE(json_agg(
              json_build_object(
                'id', passed.id,
                'firstName', passed.first_name,
                'lastName', passed.last_name,
                'email', passed.email
              )
            ), '[]'),
            'subscribed', COALESCE(json_agg(
              json_build_object(
                'id', subscribed.id,
                'firstName', subscribed.first_name,
                'lastName', subscribed.last_name,
                'email', subscribed.email
              )
            ), '[]')
          ) AS students
          FROM
            (
              select person.* FROM person, student, class_student
                WHERE person.id = student.person_id AND student.id = class_student.student_id
                  AND class_student.class_id = $1 AND class_student.has_passed IS TRUE
            ) passed
        )
      from class,
      (
        select person.* FROM person, student, class_student
          WHERE person.id = student.person_id AND student.id = class_student.student_id
            AND class_student.class_id = $1 AND class_student.has_subscribed IS TRUE
      ) subscribed
      where class.id = $1
      group by class.id;
      `,
      [classId],
      (error, results) => {
        if (error) {
          throw error;
        }

        if (!results.rows.length) {
          res.status(404).send('Class not found :(');

          return;
        }

        res.status(200).send(results.rows);
      }
    );

    return;
  }

  pool.query(
    'SELECT * FROM class',
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
