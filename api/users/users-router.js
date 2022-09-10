const express = require('express');

const Posts = require('../posts/posts-model')
const Users = require('./users-model')

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const { 
  validateUserId, 
  validateUser, 
  validatePost
} = require('../middleware/middleware')

const router = express.Router();

router.get('/', async (req, res) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  const userList = await Users.get()
  res.status(200).json(userList)
});

router.get('/:id', validateUserId, (req, res) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  res.status(200).json(req.user)
});

router.post('/', validateUser, async (req, res) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  const newUser = await Users.insert(req.body)
  res.status(201).json(newUser)
});

router.put('/:id', validateUserId, validateUser, async (req, res) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  const updatedUser = await Users.update(req.params.id, req.body)
  res.status(201).json(updatedUser)
});

router.delete('/:id', validateUserId, async (req, res) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  await Users.remove(req.params.id)
  res.status(200).json(req.user)
});

router.get('/:id/posts', validateUserId, async (req, res) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  const userPosts = await Users.getUserPosts(req.user.id)
  res.status(200).json(userPosts ? userPosts : {message: `no posts by ${req.user.name}`})
});

router.post('/:id/posts', validateUserId, validatePost, async (req, res) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  const newPost = await Posts.insert({user_id: req.user.id, text: req.text})
  res.status(201).json(newPost)
});

// do not forget to export the router
module.exports = router