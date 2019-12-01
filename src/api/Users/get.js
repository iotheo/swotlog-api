import { pool } from 'db';

const get = (req, res) => {
  const {
    token,
    id,
  } = res.locals;

  const userId = req.params.id || id;

  if (parseInt(userId, 10)) {
    pool.query(
      `SELECT
        person.id,
        person.email,
        person.first_name as "firstName",
        person.last_name as "lastName",
        COALESCE(json_agg(
          json_build_object(
            'id', connected.id,
            'firstName', connected.first_name,
            'lastName', connected.last_name
          )
        ) FILTER (WHERE connected.id IS NOT NULL))
        AS followers
            FROM person
          LEFT JOIN follow ON
            person.id = follow.follower_id
            AND following_id != person.id
          left join person as connected ON following_id = connected.id
           WHERE person.id = $1
         GROUP BY person.id`,
      [userId],
      (error, results) => {
        if (error) {
          throw error;
        }

        if (!results.rowCount) {
          res.status(404).json({
            message: 'User not found',
          });

          return;
        }

        res.status(200).json({
          ...results.rows[0],
          token,
        });
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
