import { pool } from 'db';

const getSubscribed = (req, res) => {
  const {
    id,
  } = res.locals;

  pool.query(
    `SELECT class.id, class.name
      FROM class
      INNER JOIN class_student ON class.id = class.student_id
      INNER JOIN student ON class_student.student_id = student.id
      INNER JOIN person ON person.id = student.person_id
      WHERE person.id = $1 AND has_subscribed IS true`,
    [id],
    (err, results) => {
      if (err) throw err;

      return res.status(200).send(results.rows);
    }
  );
};


export default getSubscribed;
