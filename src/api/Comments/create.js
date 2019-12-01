import { pool } from 'db';

const create = (req, res) => {
  const {
    id,
  } = req.user;

  const {
    id: discourseId,
    content,
  } = req.body;

  pool.query(
    'SELECT id FROM discourse WHERE id = $1',
    [discourseId],
    (err, results) => {
      if (err) throw err;

      if (!results.rowCount) {
        return res.status(400).json({
          message: 'Post not found',
        });
      }

      pool.query(
        `INSERT INTO comment (discourse_id, content, author_id)
          VALUES ($1, $2, $3) RETURNING id`,
        [discourseId, content, id],
        (_err, result) => {
          if (_err) throw _err;

          if (!result.rowCount) {
            return res.status(500).json({
              error: 'Something went wrong',
            });
          }

          res.status(201).json({
            message: 'The comment has been created successfully',
            data: {
              id: result.rows[0].id,
            },
          });
        }
      );
    }
  );
};

export default create;
