import { pool } from 'db';

const create = (req, res) => {
  const {
    id,
  } = req.user;

  const {
    id: groupId,
    content,
    assigneeId,
  } = req.body;

  pool.query(
    `INSERT INTO discourse (author_id, content)
      VALUES ($1, $2) RETURNING discourse.id`,
    [id, content],
    (err, results) => {
      if (err) throw err;

      const discourseId = results.rows[0].id;

      pool.query(
        `INSERT INTO task (discourse_id, group_id, assignee_id)
          VALUES ($1, $2, $3)`,
        [discourseId, groupId, assigneeId],
        _err => {
          if (_err) throw _err;

          res.status(201).json({
            message: 'A task has been successfully created',
            data: {
              id: discourseId,
            },
          });
        }
      );
    }
  );
};

export default create;
