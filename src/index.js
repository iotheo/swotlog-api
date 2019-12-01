import express from 'express';
// import session from 'express-session';
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
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// Make sure this comes after the express session
app.use(passport.initialize());

/* eslint-disable-next-line */
const initializeAuth = require('./auth/index').default;

initializeAuth(passport);

/*
  CommonJS syntax is one-way here. We cannot use ES6 syntax for such cases.
  https://stackoverflow.com/questions/31354559/using-node-js-require-vs-es6-import-export
*/
const Users = require('api/Users');
const Students = require('api/Students');
const Tutors = require('api/Tutors');
const Classes = require('api/Classes');
const Posts = require('api/Posts');
const Comments = require('api/Comments');
const Groups = require('api/Groups');
const Tasks = require('api/Tasks');


app.post('/login', Users.login, Users.get);
app.post('/users/create', Users.create);

app.all('*', passport.authenticate('jwt', { session: false }));

app.post('/users/update', Users.update);
app.post('/users/passed', Users.getPassed);
app.post('/users/subscribed', Users.getSubscribed);
app.post('/users(/:id([0-9]+))?', Users.get);
app.delete('/users/:id([0-9]+)', Users.del);

app.post('/posts/create', Posts.create);
app.post('/posts(/:id([0-9]+))?', Posts.get);

app.post('/comments/create', Comments.create);

app.post('/groups/create', Groups.create);
app.post('/groups(/:id([0-9]+))?', Groups.get);

app.post('/tasks/create', Tasks.create);

app.post('/students(/:id([0-9]+))?', Students.get);
app.post('/tutors(/:id([0-9]+))?', Tutors.get);
app.post('/classes(/:id([0-9]+))?', Classes.get);
app.post('/classes/create', Classes.create);
app.delete('/classes/:id([0-9]+)', Classes.del);
// app.delete('/users/:id', db.deleteUser);
app.post('*', (_, res) => {
  res.status(404).send('Endpoint reached no man\'s land');
});


app.listen(port, () => {
  console.log(`API is listening on port ${port}!`);
});
