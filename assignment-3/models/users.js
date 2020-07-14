const mongoose = require('mongoose')
const Schema = mongoose.Schema

const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new Schema({
	firstname: {
		type: String,
		default: '',
	},
	lastname: {
		type: String,
		default: '',
	},
	admin: {
		type: Boolean,
		default: false,
	},
})

// Passport-Local Mongoose will add a username, hash and salt field to store the username,
// the hashed password and the salt value
userSchema.plugin(passportLocalMongoose)

const Users = mongoose.model('User', userSchema)

module.exports = Users
