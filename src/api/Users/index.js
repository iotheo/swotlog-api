import get from './get';

// const create = (req, res) => {
//   const {
//     first_name: firstName,
//     last_name: lastName,
//     email,
//     registration,
//     classes,
//     posts,
//     comments,
//     likes,
//     date_of_birth: dateOfBirth,
//   } = req.body;

//   pool.query('INSERT INTO users (first_name, last_name, email, registration,\
//    classes, posts, comments, likes, date_of_birth) VALUES ($1, $2, $3)',
//   [
//     firstName,
//     lastName,
//     email,
//     registration,
//     classes,
//     posts,
//     comments,
//     likes,
//     dateOfBirth,
//   ],
//   (error, results) => {
//     if (error) {
//       throw error;
//     }

//     res.status(201).send(`User added with ID: ${results.insertId}`);
//   });
// };

export {
  get,
  // create,
};
