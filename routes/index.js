const router = require("express").Router();
const User = require('../models/User.model');
const bcryptjs = require('bcryptjs');

const { isItLogIn, isAnon } = require('../middleware/auth.middlewares')

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/signUp', isAnon, (req, res, next) => {
  res.render('signUp.hbs');
})

//........................

router.post('/signUp', isAnon, (req, res, next) => {

  if (!req.body.username || !req.body.password) {
    // res.send('Sorry you forgot a user name or password')

    res.render('signUp.hbs', { errorMessage: "Sorry you forgot a user name or password" })
    return;
  }

  User.findOne({ username: req.body.username })
    .then(foundUser => {
      if (foundUser) {
        res.render('signUp.hbs', { errorMessage: "Sorry user already exists" })
        return;
      }
      return User.create({
        username: req.body.username,
        password: bcryptjs.hashSync(req.body.password)
      })
    })

    .then(createdUser => {
      console.log('here is the new user', createdUser);
      res.render('login.hbs');
    })

    .catch(err => {
      res.send(err)
    })

})

router.get('/login', isAnon, (req, res, next) => {
  res.render('login.hbs');
})

router.post('/login', isAnon, (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    res.render('login.hbs', { errorMessage: "Sorry you are missing the email or password" })
    return;
  }

  User.findOne({ username: req.body.username })
    .then(foundUser => {
      if (!foundUser) {
        // res.send('user or password doesnt exists')
        res.render('login.hbs', { errorMessage: 'Sorry user does not exists' })
        return;
      }

      const isValidPassword = bcryptjs.compareSync(req.body.password, foundUser.password)

      if (!isValidPassword) {
        // res.send("sorry, wrong password")

        res.render('login.hbs', { errorMessage: 'Sorry wrong password' })
        return
      }

      req.session.user = foundUser;

      res.redirect('/profile');
    })

    .catch(err => {
      console.log(err);
      res.send(err)
    })



})

router.get('/profile', isItLogIn, (req, res, next) => {
  res.render('profile.hbs', req.session.user)
})

router.get('/main', isAnon , (req, res, next) => {
  res.render('main.hbs')
})

router.get('/private', isItLogIn, (req, res, next) => {
  res.render('private.hbs')
})


router.get('/logout', (req, res, next) => {
  req.session.destroy(() => {
    res.redirect('/main');
  })
});

module.exports = router;
