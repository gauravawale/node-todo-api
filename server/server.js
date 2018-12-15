let express = require('express');
let bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

let {mongoose} = require('./db/mongoose');
let {Todo} = require('./models/todo');
let {User} = require('./models/user');

let port = process.env.PORT || 3000;

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


app.listen(port, () => {
    console.log('Stared on port ', port);
});

module.exports = {
    app
}