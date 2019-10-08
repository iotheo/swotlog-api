import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

/*
  CommonJS syntax is one-way here. We cannot use ES6 syntax for such cases.
  https://stackoverflow.com/questions/31354559/using-node-js-require-vs-es6-import-export
*/
const Users = require('api/Users');

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/users(/:id([0-9]+))?', Users.get);
app.post('/users/create', Users.create);
// app.get('/users/:id', db.getUserById);
// app.put('/users/:id', db.updateUser);
// app.delete('/users/:id', db.deleteUser);
app.post('*', (req, res) => {
  res.status(404).send('Endpoint reached no man\'s land');
});


app.listen(port, () => {
  console.log(`API is listening on port ${port}!`);
});
