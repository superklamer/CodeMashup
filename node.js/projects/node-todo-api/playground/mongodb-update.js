// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }

  console.log('Connected to MongoDB server');
  const db = client.db('TodoApp');

  // db.collection('Todos').findOneAndUpdate(
  //   {task: 'Eat lunch', completed: false},
  //   {$set: {task: 'Have dinner', completed: true}},
  //   {returnOriginal: false}).then((result) => {
  //     console.log(result);
  //   });


  // update name in Users
  // increment age by 1
  db.collection('Users').findOneAndUpdate(
    {_id: new ObjectID('5c5157194ee237422045322c')},
    {$set: {name: 'Putio Marinkin'},
      $inc: {age: 1}},
    {returnOriginal: false}
  ).then((res) => {
    console.log(res);
  });



  // client.close();

});
