import { pool } from 'db';

const get = (req, res) => {
  const {
    id,
  } = req.params;

  if (parseInt(id, 10)) {
    pool.query(
      `SELECT
        groups.id,
        groups.title,
        COALESCE(
          json_agg(
            json_build_object(
              'id', task.discourse_id,
              'content', discourse.content,
              'createdAt', discourse.created_at,
              'author', json_build_object(
                'id', creator.id,
                'firstName', creator.first_name,
                'lastName', creator.last_name,
                'email', creator.email
              )
            )
          ) FILTER (WHERE discourse.id IS NOT NULL), '[]') AS tasks
        FROM groups
        LEFT JOIN task ON groups.id = task.group_id
        LEFT JOIN discourse ON discourse.id = task.discourse_id
        LEFT JOIN person AS creator ON creator.id = discourse.author_id
        LEFT JOIN person AS assignee ON assignee.id = task.assignee_id
        WHERE groups.id = $1
        GROUP by groups.id`,
      [id],
      (err, results) => {
        if (err) throw err;

        if (!results.rowCount) {
          return res.status(404).json({
            error: 'Post not found',
          });
        }

        res.status(200).send(results.rows);
      }
    );
  }

  // All Groups
  pool.query(
    `SELECT
      groups.id,
      title,
      created_at AS "createdAt",
      json_build_object(
        'id', person.id,
        'firstName', person.first_name,
        'lastName', person.last_name,
        'email', person.email
      ) AS creator
    FROM groups
    INNER JOIN person ON person.id = groups.creator_id
    `,
    [],
    (_, results) => {
      res.status(200).json(results.rows);
    }
  );
};

export default get;
