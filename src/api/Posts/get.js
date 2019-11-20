import { pool } from 'db';

const get = (req, res) => {
  const {
    id,
  } = req.params;

  if (parseInt(id, 10)) {
    pool.query(
      `SELECT
        post.discourse_id AS id,
        discourse.created_at,
        discourse.content,
        json_build_object(
          'id', author.id,
          'firstName', author.firstName,
          'lastName', author.lastName
        ) AS author,
        json_build_object(
          'id', class.id,
          'name', class.name
        ) AS class
        FROM
        (
          SELECT
            person.id,
            person.first_name AS firstName,
            person.last_name AS lastName,
            person.email AS email
            FROM person
          INNER JOIN discourse ON person.id = discourse.author_id
          INNER JOIN post ON post.discourse_id = discourse.id
          WHERE discourse.id = $1 LIMIT 1
        ) author,
        (
          SELECT class.* FROM class
            INNER JOIN post
            ON class.id = post.class_id AND post.discourse_id = $1
        ) class,
          post
          INNER JOIN discourse ON
          discourse.id = post.discourse_id
          WHERE discourse.id = $1 LIMIT 1
          `,

      [id],
      (err, results) => {
        if (err) throw err;

        if (!results.rowCount) {
          return res.status(404).send('Post not found');
        }

        res.status(200).send(results.rows[0]);
      }
    );

    return;
  }

  pool.query(
    `SELECT * FROM post`,
    (err, results) => {
      if (err) throw err;

      res.status(200).send(results.rows);
    }
  );
};

export default get;
