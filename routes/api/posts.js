const express = require('express');
const route = express.Router();
const auth = require('../../middlewares/auth');
const Post = require('../../Dbmodels/posts');
const Profile = require('../../Dbmodels/profile');
const User = require('../../Dbmodels/users');
const { check, validationResult } = require('express-validator');

//we will write these three cmmnts for every http request we code

//@route : POST api/posts
//@desc  : to create a post
//@access: Private

route.post(
  '/',
  [auth, check('text', 'Post content is required!').not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ error: errors.array() });
    }

    try {
      let user = await User.findById(req.user.id).select('-password'); // req.user.id isliye work kr rha hai kyunki jo user logged in hai uski id information to request object me hogi hi.
      const newPost = new Post({
        text: req.body.text,
        user: req.user.id,
        name: user.name,
        avatar: user.avatar,
      });
      const post = await newPost.save();
      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Internal Server Error!');
    }
  }
);

//@route : Get api/posts
//@desc  : to get all the posts of the user
//@access: Private

route.get('/', auth, async (req, res) => {
  try {
    let posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Internal Server Error!');
  }
});

//@route : Get api/posts/:p_id
//@desc  : to get the posts of the user through post id
//@access: Private

route.get('/:p_id', auth, async (req, res) => {
  try {
    let post = await Post.findById(req.params.p_id).sort({ date: -1 });
    if (!post) {
      res.status(400).json({ msg: 'Post not found!' });
    }
    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Post not found!' });
    }
    res.status(500).send('Internal Server Error!');
  }
});

//@route : DELETE api/posts/:p_id
//@desc  : to delete the posts of the user through post id
//@access: Private

route.delete('/:p_id', auth, async (req, res) => {
  try {
    let post = await Post.findById(req.params.p_id);
    if (!post) {
      res.status(400).json({ msg: 'Post not found!' });
    }
    //check user
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'user is not authorized!' });
    }
    await post.remove();
    res.json({ msg: 'Post Deleted!' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Post not found!' });
    }
    res.status(500).send('Internal Server Error!');
  }
});

//@route : PUT api/posts/like/:p_id
//@desc  : to like the post of the user through post id
//@access: Private

route.put('/like/:p_id', auth, async (req, res) => {
  try {
    let post = await Post.findById(req.params.p_id);
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      res.status(400).json({ msg: 'Post has been already liked!' });
    }
    post.likes.unshift({ user: req.user.id });

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.err(err.message);
    res.status(500).send('Internal Server Error!');
  }
});

//@route : PUT api/posts/unlike/:p_id
//@desc  : to unlike the post of the user through post id
//@access: Private

route.put('/unlike/:p_id', auth, async (req, res) => {
  try {
    let post = await Post.findById(req.params.p_id);
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      res.status(400).json({ msg: 'Post has not been liked yet!' });
    }
    //get remove index
    let removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);

    post.likes.splice(removeIndex, 1);

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.err(err.message);
    res.status(500).send('Internal Server Error!');
  }
});

//@route : PUT api/posts/comment/:p_id
//@desc  : to comment on a post though post id
//@access: Private

route.put(
  '/comment/:p_id',
  [auth, check('text', 'comment is required!').not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ error: errors.array() });
    }

    try {
      let user = await User.findById(req.user.id).select('-password');
      // req.user.id isliye work kr rha hai kyunki jo user logged in hai uski id information to request object me hogi hi.
      let post = await Post.findById(req.params.p_id);

      const newComment = {
        text: req.body.text,
        user: req.user.id,
        name: user.name,
        avatar: user.avatar,
      };
      post.comments.unshift(newComment);

      await post.save();
      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Internal Server Error!');
    }
  }
);

//@route : DELETE api/posts/comment/:p_id/:c_id
//@desc  : to delete comment on a post though post id and comment id
//@access: Private

route.delete('/comment/:p_id/:c_id', auth, async (req, res) => {
  try {
    let post = await Post.findById(req.params.p_id);
    //pullout comment
    const comment = post.comments.find(
      (comment) => comment.id === req.params.c_id
    );
    //make sure comment exixts
    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found!' });
    }
    //check user
    if (comment.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ msg: 'user not authorized for this action!' });
    }
    //get remove index
    let removeIndex = post.comments
      .map((comment) => comment.user.toString()) //yeh wahi hai mongoose.Schema.Types.ObjectId wala
      .indexOf(req.user.id);

    post.comments.splice(removeIndex, 1);

    await post.save();

    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Internal Server Error!');
  }
});

module.exports = route;
