import { pool } from 'db';
import getUpdateClassQuery from 'helpers/getUpdateClassQuery';

const update = async (req, res) => {
  const {
    id,
  } = req.user;

  const {
    firstName = req.user.firstName,
    lastName = req.user.lastName,
    classes = [],
  } = req.body;

  const client = await pool.connect();

  if (!parseInt(id, 10)) {
    client.release();

    return res.status(404).send({
      error: 'User not found',
    });
  }


  const updateUserInfo = `UPDATE person
  SET first_name = $2, last_name = $3 WHERE id = $1`;

  const getStudentId = `
    SELECT student.id as "studentId" FROM person
      INNER JOIN student ON person.id = student.person_id
      AND person.id = $1 LIMIT 1`;

  const addUserToClassIfNeeded = `
    INSERT INTO class_student (student_id, class_id)
      VALUES ($1, $2) ON CONFLICT DO NOTHING`;

  const userInfoValues = [id, firstName, lastName];

  try {
    const studentId = await client.query(getStudentId, [id])
      .then(_res => _res.rows[0].studentId);

    await client.query(updateUserInfo, userInfoValues);

    /* eslint-disable no-restricted-syntax */
    /* eslint-disable no-await-in-loop */
    if (!Array.isArray(classes)) {
      throw TypeError('classes parameter is not an array');
    }

    for (const course of classes) {
      const {
        id: classId,
        ...rest
      } = course;

      await client.query(
        addUserToClassIfNeeded,
        [studentId, course.id]
      );

      console.log('edo', course);

      await client.query(
        getUpdateClassQuery(course),
        [studentId, classId, ...Object.values(rest)]
      );
    }

    await client.query('COMMIT');

  } catch (error) {
    await client.query('ROLLBACK');

    console.log(error);

    return res.status(400).json({
      error,
    });

  } finally {
    client.release();
  }

  res.status(200).json({
    message: 'User info has been updated successfully',
  });
};

export default update;
