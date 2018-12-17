const {SHA256} = require('crypto-js');

const jwt = require('jsonwebtoken');
//
// let message = 'I am user number 1';
//
// let hash = SHA256(message).toString();
//
// console.log('Message: ', message);
// console.log('hash: ', hash);
//
// let data = {
//     id: 4
// };
//
// let token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// };
//
// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();
//
// let resulthash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
//
// if (resulthash === token.hash) {
//     console.log('Data was not changed');
// }
// else {
//     console.log('Data was changed');
// }




var data = {
    id: 10
}

let token = jwt.sign(data, '123abc');
console.log(token);


let decodedtoken = jwt.verify(token, '123abc');

console.log('decodedtoken:', decodedtoken);