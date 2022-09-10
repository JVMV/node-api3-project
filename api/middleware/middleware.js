const Users = require('../users/users-model')

function logger(req, res, next) {
  console.log(req.method, req.url, Date())
  next()
}

async function validateUserId(req, res, next) {
  const { id } = req.params
  const reqUser = await Users.getById(id)
  if(reqUser) {
    req.user = reqUser
    next()
  } else {
    res.status(404).json({ message: "user not found" })
  }
}

function validateUser(req, res, next) {
  if(!req.body.name || req.body.name.trim() === '') {
    res.status(400).json({ message: "missing required name field" })
  } else {
    next()
  }
}

function validatePost(req, res, next) {
  if(!req.body.text) {
    res.status(400).json({ message: "missing required text field" })
  } else {
    req.text = req.body.text
    next()
  }
}

// do not forget to expose these functions to other modules
module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost
}