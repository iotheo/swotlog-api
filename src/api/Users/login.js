const login = (req, res) => res.status(200).send(req.session.passport.user);

export default login;
