const jwt = require('jsonwebtoken');
const passport = require('passport');

const login = (req, res, next) => {
  return passport.authenticate('local', { session: false }, (err, user) => {
    if (err) {
      res.status(400).json({
        message: 'Something went wrong',
      });
    }

    if (!user) {
      return res.status(401).json({
        message: 'Credentials do not match',
      });
    }

    req.login(user, { session: false }, _err => {
      if (_err) {
        res.send(_err);
      }

      const token = jwt.sign(
        user,
        process.env.SECRET_TOKEN,
        {
          expiresIn: 31536000,
        }
      );

      // Nice to have for same origin
      res.cookie(
        'token',
        token,
        {
          httpOnly: true,
          maxAge: 31536000,
        }
      );

      res.locals = {
        id: req.user.id, // Used by the next() function as a param to get logged in user
        user: req.user,
        token,
      };

      return next();
    });
  })(req, res);
};

export default login;
