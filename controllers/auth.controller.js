const mongoose = require("mongoose")
const UserDb = require("../models/User.model")
const passport = require('passport');

// ----------------------- // REGISTER //  ----------------------- //
// router.get('/register', authController.register)
module.exports.register = (req, res, next) => {
  res.render('auth/register' )
}


// router.post('/register', authController.doRegister)
module.exports.doRegister = (req, res, next) => {
  const user = req.body;

  const renderWithErrors = (errors) => {
    res.render('auth/register', { errors, user })
  }

  UserDb.findOne({ email: user.email })
    .then((userFound) => {
      if (userFound) {
        renderWithErrors({ email: 'Email already in use' })
      } else {
        return UserDb.create(user)
          .then(() => {
            res.redirect('/login')
          })

      }
    })
    // display the errors assigned in the model
    // errors: {name:     ValidatorError: name needs at least 3 chars ....}
    // errors: {password: ValidatorError: password needs at least 8 chars ......
    .catch(err => {
      if (err instanceof mongoose.Error.ValidationError) {
        console.log("errorerererer",err.errors)
        renderWithErrors(err.errors)
      } else {
        next(err)
      }
    })
}


// ----------------------- // LOGIN //  ----------------------- //
// router.get('/login', authController.login)
module.exports.login = (req, res, next) => {
  res.render('auth/login')
}

// router.post('/login', authController.doLogin)
module.exports.doLogin = (req, res, next) => {
  
  passport.authenticate('local-auth', (err, user, validations) => {
    if (err) {
      next(err)
    } else if(!user) {
      res.status(404).render('auth/login', { errorMessage: validations.error })
    } else {
      req.login(user, (loginError) => {
        if (loginError) {
          next(loginError)
        } else {
          res.redirect('/profile')
        }
      })
    }
  })(req, res, next)
}



//----------------------- // LOGOUT //  ----------------------- //
module.exports.logout = (req, res, next) => {
  req.logout();
  res.redirect('/login');
}