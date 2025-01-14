require('./config/config');

var _ = require('lodash');
var express = require('express') ;
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {ObjectID} = require('mongodb');
var {authenticate} = require('./middleware/authenticate');

const port = process.env.PORT || 3000;

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/todos', authenticate,  (req, res) => {
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos', authenticate,  (req, res) => {
  Todo.find({
      _creator: req.user._id
    }
  ).then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;
  // res.send(req.params);

  // Check if id is isValid
  if (!ObjectID.isValid(id)) {
    res.status(404).send();
  }

  // findById
    Todo.findOne({
      _id: id,
      _creator: req.user._id
    }).then((todo) => {
      if (todo) {
        res.send(todo);
      } else {
        res.status(404).send();
      }
    }).catch((e) => {
      res.status(400).send();
    });
});

app.delete('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send({});
  }

  Todo.findOneAndDelete({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
    if (!todo) {
      return res.status(404).send({});
    }

    res.status(200).send({todo});
  }).catch((e) => {
    res.status(400).send({});
  });
});

app.patch('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send({});
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findOneAndUpdate({
    _id: id,
    _creator: req.user._id
  }, {$set: body}, {new: true}).then((todo) => {
      if (!todo) {
        return res.status(404).send();
      }

      res.send({todo});
    }).catch((e) => res.status(400).send());
});

app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then(() => {
    var token = user.generateAuthToken();
    return token;
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  });
});

app.get('/users/me', authenticate ,(req, res) => {
  res.send(req.user);
});

app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => {
      return user.generateAuthToken().then((token) => {
        res.header('x-auth', token).send(user);
      });
  }).catch((e) => {
    res.status(400).send();
  });
});

app.delete('/users/me/token', authenticate ,(req, res) => {
   req.user.removeToken(req.token).then(() => {
     res.status(200).send();
   }, () => {
     res.status(401).send();
   });
});


app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});


module.exports = {app};
