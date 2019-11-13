import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import morgan from 'morgan';
import passport from 'passport';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT;

// Middleware
morgan.token('reqBody', req => JSON.stringify(req.body, null, '\u00A0\u00A0'));

app.use(morgan(':method :url :status :res[content-length] - :response-time ms \n:reqBody'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  maxAge: 31536000, // 1 year
}));
app.use(cors());

// Make sure this comes after the express session
app.use(passport.initialize());
app.use(passport.session());

const { initializeAuth } = require('./auth/index');

initializeAuth(passport);

/*
  CommonJS syntax is one-way here. We cannot use ES6 syntax for such cases.
  https://stackoverflow.com/questions/31354559/using-node-js-require-vs-es6-import-export
*/
const Users = require('api/Users');
const Students = require('api/Students');
const Tutors = require('api/Tutors');
const Classes = require('api/Classes');

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/users(/:id([0-9]+))?', Users.get);
app.post('/users/create', Users.create);
app.delete('/users/:id([0-9]+)', Users.del);
app.post('/students(/:id([0-9]+))?', Students.get);
app.post('/tutors(/:id([0-9]+))?', Tutors.get);
app.post('/login', passport.authenticate('local'), Users.login);
app.post('/classes(/:id([0-9]+))?', Classes.get);
app.post('/classes/create', Classes.create);
app.delete('/classes/:id([0-9]+)', Classes.del);

// app.delete('/users/:id', db.deleteUser);
app.post('*', (req, res) => {
  res.status(404).send('Endpoint reached no man\'s land');
});


app.listen(port, () => {
  console.log(`API is listening on port ${port}!`);
});
