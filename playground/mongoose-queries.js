const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {Users} = require('./../server/models/user');



// let id = '6c127c066e058764c9c57d581';
//
// if (!ObjectID.isValid(id)) {
//     console.log('ID not valid');
// }

// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('Todos', todos);
// });
//
// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log('Todo', todo);
// });

// Todo.findById(id).then((todoById) => {
//     if (!todoById)
//         return console.log('Id not found');
//     console.log('todoById', todoById);
// }).catch(e => console.log(e));



let id = '5c13ba9efa75af5e427d122b';

Users.findById(id).then((userById) => {
    if (!userById)
        return console.log('Id not found');
    console.log('userById', userById);
}).catch(e => console.log(e));
