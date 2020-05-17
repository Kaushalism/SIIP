const express = require('express');
const route = express.Router();
const config = require('config');
const request = require('request');
const user = require('../../Dbmodels/users');
const Profile = require('../../Dbmodels/profile');
const auth = require('../../middlewares/auth');
const { check, validationResult } = require('express-validator');

//we will write these three cmmnts for every http request we code

//@route : GET api/profile/me
//@desc  : to show profile
//@access: private

route.get('/me', auth, async (req, res) => {
  try {
    console.log(req.user.id);
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['name', 'avatar']);
    if (!profile) {
      res.status(400).json({ msg: `the user's profile doesn't exixts!` });
    } else {
      res.json(profile);
    }
  } catch (err) {
    console.error(err.message);
  }
});

//@route : POST api/profile/me/search
//@desc  : to search profile
//@access: private
// data agar client side se aa rha ht o post request ka use hoga

route.post('/me/search', auth, async (req, res) => {
  const { githubusername } = req.body;
  try {
    let profilefecth = await Profile.findOne({ githubusername });
    if (!profilefecth) {
      return res.status(400).json({ msg: 'User Profile not Found!' });
    } else {
      return res.json(profilefecth);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Internal Server Error!' });
  }
});

//@route : POST api/profile
//@desc  : to create profile
//@access: private

route.post(
  '/',
  [
    auth,
    check('role', 'Role is required!').not().isEmpty(),
    check('skills', 'Skills is required!').not().isEmpty(),
    check('branch', 'Branch/Stream is required!').not().isEmpty(),
    check('year', 'Year is required!').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }

    //destructuring to pull out the values from the req object.

    const {
      branch, //company
      location,
      year, //website
      bio,
      skills,
      role, //status
      githubusername,
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook,
    } = req.body;

    //creating profile object

    const profileFields = {};

    profileFields.user = req.user.id;
    if (branch) profileFields.branch = branch;
    if (location) profileFields.location = location;
    if (year) profileFields.year = year;
    if (bio) profileFields.bio = bio;
    if (role) profileFields.role = role;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(',').map((skills) => skills.trim());
    }

    //social media object
    profileFields.social = {};

    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;
    //findone() find wali koi bhi func mongoDB realted hai and promise return krti hai.
    try {
      let profile = await Profile.findOne({ user: req.user.id }); //request ke andar jo user ki id hai us se find kro!
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }
      //create a new profile
      profile = new Profile(profileFields); // to create a new profile/ instance new keyword is used
      await profile.save(); // to save the created instance these are mongo commands.

      return res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Internal Server Error!');
    }
  }
);

//@route : GET api/profile
//@desc  : to get all the profiles
//@access: public

route.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']); // find() to get all
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Internal Server Error!');
  }
});

//@route : GET api/profile/user/:user_id
//@desc  : to get a specific profile through id
//@access: public

route.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);
    if (!profile) {
      res.status(400).json({ msg: 'User profile does not exists!' });
    } else {
      res.json(profile);
    }
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
      res.status(400).json({ msg: 'User Profile Not Found!' });
    }
    res.status(500).send('Internal Server Error!');
  }
});

//@route : DELETE api/profile
//@desc  : to delete a profile,user,posts
//@access: private

route.delete('/', auth, async (req, res) => {
  try {
    await Profile.findOneAndRemove({ user: req.user.id });
    await user.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: 'User Deleted!' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Internal Server Error!');
  }
});

//@route : PUT api/profile/experience
//@desc  : to add experience array to the profile
//@access: private

route.put(
  '/experience',
  [
    auth,
    check('title', 'Title is required!').not().isEmpty(),
    check('company', 'Company name is required!').not().isEmpty(),
    check('from', 'From date is required!').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    } = req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      profile.experience.unshift(newExp); // to add the newest experience to the first of the block
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Internal Server Error!');
    }
  }
);

//@route : DELETE api/profile/experience/:exp_id
//@desc  : to delete experience from the profile
//@access: private

route.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    // get remove index from the array of objects experience
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);

    profile.experience.splice(removeIndex, 1);

    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Internal Server Error!');
  }
});

//@route : PUT api/profile/education
//@desc  : to add education array to the profile
//@access: private

route.put(
  '/education',
  [
    auth,
    check('school', 'School is required!').not().isEmpty(),
    check('degree', 'Degree is required!').not().isEmpty(),
    check('fieldofstudy', 'Field Of Study is required!').not().isEmpty(),
    check('from', 'From date is required!').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    } = req.body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      profile.education.unshift(newEdu); // to add the newest education to the first of the block
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Internal Server Error!');
    }
  }
);

//@route : DELETE api/profile/eductaion/:edu_id
//@desc  : to delete education from the profile
//@access: private

route.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    // get remove index from the array of objects experience
    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.edu_id);

    profile.education.splice(removeIndex, 1);

    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Internal Server Error!');
  }
});

//@route : GET api/profile/github/username
//@desc  : to get 5 user git repo
//@access: public

//config dependency jo cofig folder me json hota hai use use kr skti hai
route.get('/github/:username', async (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        'GitclientId'
      )}&clientSecret=${config.get('GitclientSecret')}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' },
    };

    request(options, (error, response, body) => {
      if (error) {
        console.error(error);
      }
      if (response.statusCode !== 200) {
        return res.status(404).json({ msg: 'No github repository found!' });
      }
      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Internal Server Error!');
  }
});

module.exports = route;
