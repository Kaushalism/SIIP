//@desc : for login facility

const express = require('express');
const route = express.Router();
const auth = require('../../middlewares/auth');
const User = require('../../Dbmodels/users');
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

//@route : api/auth
//@desc  : token access
//@access: private
route.get('/', auth, async (req, res) => {
  // whenever we interact with the mongo db we will get a promise to interact with thus we need to define async-await
  try {
    const user = await User.findById(req.user.id).select('-password'); //-pass will exclude password
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Internal Server Error!' });
  }
});

//@route : POST api/auth
//@desc  : user login facility
//@access: public
route.post(
  '/',
  [
    check('email', 'Please Enter a valid Email!').isEmail(),
    check('password', 'Password is required!').exists(),
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ errorOccured: error.array() });
    }

    const { email, password } = req.body;

    try {
      //see if the user exists
      let user = await User.findOne({ email }); // findOne() function is used to search element in a object/anything.
      if (!user) {
        return res
          .status(400)
          .json({ error: [{ msg: 'Invalid Login Credentials!' }] });
        //status 400 res bhejte hain aur saath me ek json file bhi jisme error hai.
      }
      //password verification
      const isMatch = bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: [{ msg: 'Password Invalid!' }] });
      }

      //return jswebtoken
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtsecret'),
        { expiresIn: 36000 },
        (err, token) => {
          if (err) {
            throw err;
          } else {
            res.json({ token });
          }
        }
      );
    } catch (error) {
      console.error(error.message); // yeh bahut imp hai .message easy lang me error kya h wo btata hai
      res.status(500).send('Internal Server Error!');
    }
  }
);

module.exports = route;
