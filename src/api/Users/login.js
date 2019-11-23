const jwt = require('jsonwebtoken');
const passport = require('passport');

const login = (req, res) => {
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

      return res.status(200).json({
        user: req.user,
        token,
      });
    });
  })(req, res);
};

export default login;
