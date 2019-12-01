import { pool } from 'db';

const get = (req, res) => {
  const {
    niceToHave,
  } = req.params;

  const {
    id,
  } = req.user;

  // User's posts
  if (parseInt(niceToHave, 10)) {
    pool.query(
      `SELECT
        discourse.id,
        discourse.content,
        discourse.created_at as "createdAt",
        COALESCE(
          json_build_object(
          'id', class.id,
          'name', class.name
        ), '{}') as class,
        COALESCE(
          json_build_object(
            'id', person.id,
            'firstName', person.first_name,
            'lastName', person.last_name,
            'email', person.email
          ), '{}') as author,
          json_agg(
            json_build_object(
              'id', comment.id,
              'content', comment.content,
              'author', json_build_object(
                'id', person.id,
                'firstName', author.first_name,
                'lastName', author.last_name
              )
            )
          ) FILTER (WHERE comment.id IS NOT NULL) as comments
          FROM class
          INNER JOIN post ON post.class_id = class.id
          INNER JOIN discourse ON discourse.id = post.discourse_id
          INNER JOIN person ON person.id = discourse.author_id
          LEFT JOIN comment on comment.discourse_id = discourse.id
          LEFT JOIN person as author on comment.author_id = author.id
          WHERE discourse.id = $1
          GROUP BY discourse.id, class.id, person.id
          LIMIT 1`,
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

  // Users' feed
  pool.query(
    `SELECT
      discourse.id,
      discourse.content,
      discourse.created_at as "createdAt",
      COALESCE(
        json_build_object(
        'id', class.id,
        'name', class.name
      ), '{}') as class,
      COALESCE(
        json_build_object(
          'id', person.id,
          'firstName', person.first_name,
          'lastName', person.last_name,
          'email', person.email
        ), '{}') as author,
        json_agg(
          json_build_object(
            'id', comment.id,
            'content', comment.content,
            'author', json_build_object(
              'id', person.id,
              'firstName', author.first_name,
              'lastName', author.last_name
            )
          )
        ) FILTER (WHERE comment.id IS NOT NULL) as comments
    FROM class
    INNER JOIN post ON post.class_id = class.id
    INNER JOIN discourse ON discourse.id = post.discourse_id
    INNER JOIN person ON person.id = discourse.author_id
    LEFT JOIN comment on comment.discourse_id = discourse.id
    LEFT JOIN person as author on comment.author_id = author.id
    GROUP BY discourse.id, class.id, person.id
    ORDER BY discourse.created_at desc
    `,
    (err, results) => {
      if (err) throw err;

      return res.status(200).send(results.rows);
    }
  );
};

export default get;
