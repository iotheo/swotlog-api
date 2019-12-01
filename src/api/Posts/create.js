import { pool } from 'db';

const create = (req, res) => {
  const {
    id,
  } = req.user;

  const {
    content,
    classId,
  } = req.body;

  pool.connect((err, client, done) => {
    if (err) throw err;

    client.query(
      'INSERT into discourse (author_id, content) values ($1, $2) RETURNING discourse.id',
      [id, content],
      (_err, result) => {
        if (_err) throw _err;

        const discourse = result.rows[0];

        client.query(
          'INSERT INTO post (discourse_id, class_id) values ($1, $2)',
          [discourse.id, classId],
          (__err, _) => {
            if (__err) {
              res.status(500).json({
                error: 'Something went wrong',
              });

              throw __err;
            }

            res.status(200).json({
              message: 'Post has been created successfully',
              data: {
                id: discourse.id,
              },
            });
          }
        );
      }
    );

    done();
  });
};


export default create;
