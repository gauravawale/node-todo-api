const validator = require('validator');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

let UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: `{VALUE} is not valid email`
        }
    },
    password: {
        type: String,
        require: true,
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


// Instance methods can be created by adding the method to UserSchema.methods
UserSchema.methods.toJSON = function() {
  let user = this;
  let userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email'])

};

UserSchema.methods.generateAuthToken = function() {
    let user = this;
    let access = 'auth';
    let token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

    user.tokens = user.tokens.concat([{access, token}]);

    // Commenting the lines below because of inconsistency in the mongodb and wrote the replacement above
    // user.tokens.push({
    //     access,
    //     token
    // });

    return user.save().then(() => {
        return token;
    })
};

UserSchema.methods.removeToken = function(token) {
    let user = this;

    return user.update({
       $pull: {
           tokens: {
               token: token
           }
       }
    });
};

// Model methods can be created by adding the method to UserSchema.statics
UserSchema.statics.findByToken = function(token) {
    let User = this;
    let decoded;

    try {
        decoded = jwt.verify(token, 'abc123');
    } catch(e) {
        return Promise.reject();
    }

    return User.findOne({
        _id: decoded._id,
        "tokens.token": token,
        "tokens.access": "auth"
    });
};


UserSchema.statics.findByCredentials = function(email, password) {
    let User = this;
    return User.findOne({email}).then(user => {
        if (!user) {
            return Promise.reject('Unable to find the user with this email');
        }

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, result) => {
                if (result)
                    resolve(user);
                else
                    reject('Password is incorrect');
            });
        });
    });
};

UserSchema.pre('save', function(next) {
    let user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    }
    else {
        next();
    }
});

let Users = mongoose.model('Users', UserSchema);

module.exports = {Users};