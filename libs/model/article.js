var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var oldUser = new Schema({
	name: { type: String, required: true },
	dateFrom: { type: String, required: true },
	dateTo: { type: String, required: true }
});

var Book = new Schema({
	name: { type: String, required: true },
	author: { type: String, required: true },
	year: { type: String, required: true },
	pages: { type: String, required: true },
    description: { type: String, required: true },
	oldUsers: [oldUser]
});


var User = new Schema({
        email: {
            type: String,
            unique: true,
            required: true
        },
        hashedPassword: {
            type: String,
            required: true
        },
        salt: {
            type: String,
            required: true
        },
        university: {
            type: String,
            required: true
        },
        faculty: {
            type: String
        },
        group: {
            type: String
        },
        library: {
            type: String
        },
        books: [Book]
    });

User.methods.encryptPassword = function(password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
    //more secure - return crypto.pbkdf2Sync(password, this.salt, 10000, 512).toString('hex');
};

User.virtual('userId')
    .get(function () {
        return this.id;
    });

User.virtual('password')
    .set(function(password) {
        this._plainPassword = password;
        this.salt = crypto.randomBytes(32).toString('hex');
        //more secure - this.salt = crypto.randomBytes(128).toString('hex');
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function() { return this._plainPassword; });


User.methods.checkPassword = function(password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

module.exports = mongoose.model('User', User);
