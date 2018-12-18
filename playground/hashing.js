const {SHA256} = require('crypto-js');

const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');


let password = '123abc';

bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        console.log(hash);
    });
});


let hashedPassword = '$2a$10$qMke2FL.No/UcHt.W0kCTOm9r6YA0XZI3shS5WHc9eMCEMTv4Q1P.';

bcrypt.compare(password, hashedPassword, (err, result) => {
    console.log(result);
});
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


//
//
// var data = {
//     id: 10
// }
//
// let token = jwt.sign(data, '123abc');
// console.log(token);
//
//
// let decodedtoken = jwt.verify(token, '123abc');
//
// console.log('decodedtoken:', decodedtoken);



