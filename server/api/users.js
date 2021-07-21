const router = require('express').Router();
const { User } = require('../db/models');

module.exports = router;
router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      // explicitly select only the id and email fields - even though
      // users' passwords are encrypted, it won't help if we just
      // send everything to anyone who asks!
      attributes: ['id', 'email'],
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
});

//Create a new user
router.post('/', async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    if (newUser) {
      res.status(200).json(newUser);
    } else {
      const error = new Error('WOOOMP: sorry Failed to POST /api/user');
      error.status = 500;
      throw error;
    }
  } catch (error) {
    next(error);
  }
});
