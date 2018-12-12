const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, client) => {
    if (error)
        return console.log(`Unable to connect to MongoDB server`);
    console.log('Connected to MongoDB Server...');

    const db = client.db('TodoApp');

    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: false
    // }, (err, result) => {
    //     if (error)
    //         return console.log(`Unable to insert record in Todos collection`);
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    db.collection('Users').insertOne({
        name: 'Gaurav',
        age: 28,
        location: 'Pune'
    }, (err, result) => {
        if (error)
            return console.log(`Unable to insert record in Users collection`);
        console.log(JSON.stringify(result.ops, undefined, 2));
    })
    client.close();

});