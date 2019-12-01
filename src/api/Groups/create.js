import { pool } from 'db';

const create = (req, res) => {
  const {
    id,
  } = req.user;

  const {
    title,
  } = req.body;

  pool.query(
    `INSERT INTO groups (creator_id, title)
    VALUES ($1, $2) RETURNING groups.id`,
    [id, title],
    (err, result) => {
      if (err) {
        res.status(500).json({
          error: 'Something went wrong',
        });

        throw err;
      }

      const groupId = result.rows[0].id;


      pool.query(
        `INSERT INTO group_person (group_id, person_id) VALUES
        ($1, $2)`,
        [groupId, id],
        _err => {
          if (_err) throw _err;

          res.status(201).json({
            message: 'Group successfully created',
            data: {
              id: groupId,
            },
          });
        }
      );
    }
  );
};

export default create;
