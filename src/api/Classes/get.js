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

  // TODO fix classes with no posts
  pool.query(
    `SELECT
      class.*,
      array_agg(
        json_build_object(
          'id', post.discourse_id,
          'content', discourse.content,
          'createdAt', discourse.created_at,
          'author', json_build_object(
            'id', person.id,
            'firstName', person.first_name,
            'lastName', person.last_name,
            'email', person.email
        )
      )
    ) as posts
    FROM class
    LEFT JOIN post ON post.class_id = class.id
    LEFT JOIN discourse ON discourse.id = post.discourse_id
    LEFT JOIN person ON person.id = discourse.author_id
    group by class.id`,
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
