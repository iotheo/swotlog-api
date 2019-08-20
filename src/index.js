import express from 'express';
import bodyParser from 'body-parser';

import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT;

// +++ MIDDLEWARE +++
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

const db = require('./db.js');

app.get('/', (req, res) => {
  res.send('Hello World!')
});
app.get('/users', db.getUsers);
app.post('/users', db.createUser);
app.get('/users/:id', db.getUserById);
app.put('/users/:id', db.updateUser);
app.delete('/users/:id', db.deleteUser);


app.listen(port, () => {
  console.log(`API is listening on port ${port}!`)
});