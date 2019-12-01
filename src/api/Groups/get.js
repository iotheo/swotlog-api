import { pool } from 'db';

const get = (req, res) => {
  pool.query(
    `SELECT group.* FROM groups

    `
  );
};

export default get;
