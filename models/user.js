var mongoose = require('mongoose');
//var bcrypt   = require('bcrypt-nodejs');
var bcrypt   = require('bcrypt')

var userSchema = mongoose.Schema({
    local: {
        username: String,
        fullName: String,
        phoneNumber: String,
        password: String,
        point: Number,
        shopPath: String,
        followingSellers: Array,
        createDate: { type: Date, default: Date.now },

    },
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);
