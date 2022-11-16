const router = require("express").Router();
const User = require('../models/User.model');
const bcryptjs = require('bcryptjs');

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/signUp', (req, res, next) => {
  res.render('signUp.hbs');
})

router.post('/signUp', (req, res, next) => {

  if (!req.body.username || !req.body.password) {
    res.send('Sorry you forgot a user name or password')
    return;
  }

  User.findOne({ username: req.body.username })
    .then(findUser => {
      if (findUser) {
        res.send('user already exists')
        return;
      }
      return User.create({
        username: req.body.username,
        password: bcryptjs.hashSync(req.body.password)
      })
    })

    .then(createdUser => {
      console.log('here is the new user', createdUser);
      res.send(createdUser);
    })

    .catch(err => {
      res.send(err)
    })

})

module.exports = router;
