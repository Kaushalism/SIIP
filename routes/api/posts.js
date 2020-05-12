const express = require('express');
const route = express.Router();

//we will write these three cmmnts for every http request we code

//@route : api/posts
//@desc  : test request
//@access: public
route.get('/', (req, res) => {
  res.send('posts get request test!');
});

module.exports = route;
