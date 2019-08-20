const Pool = require('pg').Pool;

const config = {
    user: process.env.DATABASE_USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
};

const pool = new Pool(config);

pool.on('connect', () => {
    console.log('Connected to Database!');
});

const getUsers = (req, res) => {
    pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
        if(error) {
            throw error;
        }
        res.status(200).json(results.rows);
    })
}

const createUser = (req, res) => {
    const { username, email, password } = req.body;
  
    pool.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3)', [username, email, password], (error, results) => {
      if (error) {
        throw error;
      }
      res.status(201).send(`User added with ID: ${results.insertId}`)
    });
}

const getUserById = (req, res) => {
    const id = parseInt(req.params.id)
  
    pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      res.status(200).json(results.rows)
    })
  }

const updateUser = (req, res) => {
    const id = parseInt(req.params.id)
    const { username, email, password } = req.body
  
    pool.query(
      'UPDATE users SET username = $1, email = $2, password = $3 WHERE id = $4',
      [username, email, password, id],
      (error, results) => {
        if (error) {
          throw error
        }
        res.status(200).send(`User modified with ID: ${id}`)
      }
    )
  }
  
  const deleteUser = (req, res) => {
    const id = parseInt(req.params.id)
  
    pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      res.status(200).send(`User deleted with ID: ${id}`)
    })
  }

module.exports = {
    getUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser,
}