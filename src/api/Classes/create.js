import { pool } from 'db';

const create = (req, res) => {
  const className = req.body.name;

  if (!className) {
    return res.status(400).json({
      error: 'Missing parameter: name',
    });
  }

  // Early bail-out for existing class names
  pool.connect((err, client, done) => {
    if (err) throw err;

    client.query(
      'SELECT name FROM class WHERE name = $1 LIMIT 1',
      [className],
      (_err, results) => {
        if (_err) throw _err;

        console.table(results.rowCount);

        if (results.rowCount) {
          done();

          return res.status(409).send(`Class with name ${className} already exists`);
        }


        client.query(
          'INSERT INTO class (name) VALUES ($1)',
          [className],
          (__err, __results) => {
            if (__err) throw __err;
          });

        done();

        return res.status(201).send('Class created successfully');
      }
    );
  });
};

export default create;
