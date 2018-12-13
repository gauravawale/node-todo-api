const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, client) => {
    if (error)
        return console.log(`Unable to connect to MongoDB server`);
    console.log('Connected to MongoDB Server...');

    const db = client.db('TodoApp');

    db.collection('Users').find({name: 'Gaurav'}).toArray().then((docs) => {
        console.log('Todos');
        console.log(JSON.stringify(docs, undefined, 2));

    }, (err) => {
        console.log(`unable to fetch Todos ${err}`);
    });

    // db.collection('Users').find({name: 'Gaurav'}).count().then((count) => {
    //     console.log('Todos');
    //     console.log(count);
    //
    // }, (err) => {
    //     console.log(`unable to fetch Todos ${err}`);
    // });
    //client.close();

});