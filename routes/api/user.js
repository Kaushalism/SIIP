const express = require('express');
const route = express.Router();
const { check, validationResult } = require('express-validator'); // this is es6 destructuring
const User = require('../../Dbmodels/users');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

//we will write these three cmmnts for every http request we code
//for proper notes of function visit us=demy mern braad traversy.

//@route : POST api/users
//@desc  : to register user
//@access: public
route.post(
  '/',
  [
    check('name', 'Please enter your Name!').not().isEmpty(),
    check('email', 'Please Enter a valid Email!').isEmail(),
    check(
      'password',
      'Please Enter a Password with 6 or more characters!'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ errorOccured: error.array() });
    }

    const { name, email, password } = req.body;

    try {
      //see if the user exists
      let user = User.findOne({ email }); // findOne() function is used to search element in a object/anything.
      if (user) {
        return res
          .status(400)
          .json({ error: [{ msg: 'User Already Exists!' }] });
        //status 400 res bhejte hain aur saath me ek json file bhi jisme error hai.
      }

      //get users gravatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      });

      user = new User({
        name,
        email,
        avatar,
        password,
      });

      //encrypt password
      let salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      //return jswebtoken
      res.send('User Account Created!');
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Internal Server Error!');
    }
  }
);

module.exports = route;
