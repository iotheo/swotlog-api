import { pool } from 'db';

const create = (req, res) => {
  const {
    id,
  } = req.user;

  const {
    followingId,
  } = req.body;

  // Query can be refactored properly in a next version
  pool.query(
    `INSERT INTO follow (follower_id, following_id)
      VALUES ($1, $2), ($2, $1)`,
    [id, followingId]
  );


  res.status(201).json({
    message: 'Connection has been successfully created',
  });
};

export default create;
