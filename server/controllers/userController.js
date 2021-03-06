var User = require('../models/user.js');
var Users = require('../collections/users.js');
var jwt = require('jwt-simple');

module.exports = {
  createUser: function (req, res, next) {
    var newUser = User.forge({
      username: req.body.username,
      password: req.body.password,
      name: req.body.name,
      email: req.body.email,
      bio: req.body.bio || null
    });

    User.forge({username: newUser.username})
    .fetch()
    .then(function (user) {
      if (user) {
        next(new Error('User already exists'));
      } else {
        newUser.save()
        .then(function (user) {
          user.token = jwt.encode(user, 'secret');
          console.log('token attached')
          res.json(user);
        })
        .catch(function (err) {
          console.log('error is: ', err)
          next(err);
        });
      }
    })
    .catch(function (err) {
      next(err);
    });
  },
  deleteUser: function (req, res, next) {
    User.forge({id: req.params.id})
    .fetch()
    .then(function (user) {
      user.save({active: false})
      .then(function (user) {
        res.json({error: false, data: {message: 'User successfully deleted'}});
      })
      .catch(function (err) {
        next(err);
      });
    })
    .catch(function (err) {
      next(err);
    });
  },
  getUser: function (req, res, next) {
    console.log(req);
    User.forge({id: req.params.id})
    .fetch()
    .then(function (user) {
      res.json({error: false, data: user});
    })
    .catch(function (err) {
      next(err);
    });
  },
  getUsers: function (req, res, next) {
    Users.forge()
    .fetch()
    .then(function (users) {
      res.json({error: false, data: users});
    })
    .catch(function (err) {
      next(err);
    });
  },
  updateUser: function (req, res, next) {
    User.forge({id: req.params.id})
    .fetch()
    .then(function (user) {
      user.save(req.body)
      .then(function (user) {
        res.json({error: false, data: {message: 'User updated successfully'}});
      })
      .catch(function (err) {
        next(err);
      });
    })
    .catch(function (err) {
      next(err);
    });
  },
  signin: function (req, res, next)  {
    User.forge({username: req.body.username})
    .fetch()
    .then(function (user) {
      if (!user) {
        next(new Error('User does not exist'));
      } else {
        user.comparePasswords(req.body.password)
        .then(function (isMatch) {
          if (isMatch) {
            user.token = jwt.encode(user, 'secret');
            res.json(user);
          } else {
            next(new Error('Invalid password'));
          }
        })
        .catch(function (err) {
          next(err);
        });
      }
    })
    .catch(function (err) {
      next(err);
    });
  }
};
