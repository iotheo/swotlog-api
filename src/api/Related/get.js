import { pool } from 'db';

const get = (req, res) => {
  const {
    id,
  } = req.user;

  pool.query(
    `SELECT
      person.id,
      person.first_name AS "firstName",
      person.last_name AS "lastName",
      email AS "email"
      FROM person
      INNER JOIN student ON student.person_id = person.id
      INNER JOIN class_student ON class_student.student_id = student.id
      INNER JOIN class ON class_student.class_id = class.id
        AND class_student.has_subscribed is true
      WHERE person.id != $1
      AND person.id NOT IN (
        SELECT following_id
        FROM follow
        WHERE follower_id = $1
        AND following_id != $1
      )
      AND class_student.class_id in (
        SELECT class.id FROM class
        INNER JOIN class_student ON class.id = class_student.class_id
        INNER JOIN student ON student.id = class_student.student_id
        INNER JOIN person ON student.person_id = person.id
        WHERE person.id = $1
      )
      group by person.id`,
    [id],
    (err, results) => {
      if (err) throw err;

      if (!results.rowCount) {
        return res.status(404).json({
          message: 'No related users found for you',
        });
      }

      res.status(200).send(results.rows);
    }
  );
};

export default get;
