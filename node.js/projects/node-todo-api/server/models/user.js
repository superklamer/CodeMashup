const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: '{VALUE} is not a valid email'
      }
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    tokens: [{
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    }]

  });

  userSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject(); // convert monogDB object to regular object

    return _.pick(userObject, ['_id', 'email']); // return only the object properties we want, not all.
  };

  userSchema.methods.generateAuthToken = function() {
    var user = this;
    var access = "auth";
    var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();

    user.tokens = user.tokens.concat([{access, token}]);

    return user.save().then(() => {
      return token
    });
  };

  userSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return Promise.reject();
    }

    return User.findOne({
      '_id': decoded._id,
      'tokens.token': token,
      'tokens.access': 'auth'
    });
  };

   userSchema.statics.findByCredentials = function (email, password) {
     var User = this;
     return User.findOne({email}).then((user) => {
       if (!user) {
         return Promise.reject();
       }

       return user;
     }).then((user) => {
       return bcrypt.compare(password, user.password).then((res) => {
         if (!res) {
           return Promise.reject();
         }

         return user;
       });
     });
   };

  userSchema.pre('save', function (next) {
    var user = this;

    if (user.isModified('password')) {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.password, salt, (err, hash) => {
          user.password = hash;
          next();
        });
      });
    } else {
      next();
    }
  });

  userSchema.methods.removeToken = function (token) {
    var user = this;

    return user.update({
      $pull: {
        tokens: { token }
      }
    });

  };


var User = mongoose.model('User', userSchema);


module.exports = {User};
