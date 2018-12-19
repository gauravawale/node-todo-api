require('./config/config');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

let {mongoose} = require('./db/mongoose');
let {Todo} = require('./models/todo');
let {Users} = require('./models/user');
let {authenticate} = require('./middleware/authenticate');

let port = process.env.PORT;

let app = express();
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    let todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err);
    });
});

app.get('/todos', (req, res) => {
   Todo.find().then((todos) => {
       res.send({
          todos
       });
   }, (err) => {
       res.status(400).send(err);
   }) ;
});

app.get('/todos/:id', (req, res) => {
    let id = req.params.id;
    if (!ObjectID.isValid(id))
        res.status(404).send();
    else {
        Todo.findById(id).then((todo) => {
            if (!todo)
                res.status(404).send();
            else
                res.send({todo});
        }).catch(e =>  res.status(400).send());
    }
});

app.delete('/todos/:id', (req, res) => {
   let id = req.params.id;

   if(!ObjectID.isValid(id))
       res.status(404).send();
   else {
       Todo.findByIdAndRemove(id).then((todo) => {
          if (!todo)
              res.status(404).send();
          else
              res.send({todo});
       }).catch(e =>  res.status(400).send());
   }
});

app.patch('/todos/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['text', 'completed']);

    if(!ObjectID.isValid(id))
        return res.status(404).send();

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    }
    else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if (!todo)
            res.status(404).send();
        else
            res.send({todo});
    }).catch(e =>  res.status(400).send());
});

//POST /users
app.post('/users', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);
    let user = new Users(body);

    user.save().then((user) => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/users/login', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);

    Users.findByCredentials(body.email, body.password).then((user) => {
        user.generateAuthToken().then(token => {
            res.header('x-auth', token).send(user);
        });
    }).catch(err => {
        res.status(400).send(err);
    });
});


app.listen(port, () => {
    console.log('Stared on port ', port);
});

module.exports = {
    app
}