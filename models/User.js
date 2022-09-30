const mongoose = require('mongoose')
const bycrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please add a name'],
		minlength: 3,
		maxlength: 50,
	},
	email: {
		type: String,
		required: [true, 'Please add a email'],
		match: [
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			'Please add a valid email',
		],
		unique: [true, 'Email already exists'],
	},
	password: {
		type: String,
		required: [true, 'Please add a password'],
		minlength: 6,
		// maxlength: 12,
	},
})

UserSchema.pre('save', async function () {
	const salt = await bycrypt.genSalt(10)
	this.password = await bycrypt.hash(this.password, salt)
	// next()
})

UserSchema.methods.createJWT = function () {
	return jwt.sign(
		{ userId: this._id, name: this.name },
		process.env.JWT_SECRET,
		{ expiresIn: process.env.JWT_LIFETIME }
	)
}

UserSchema.methods.comparePassword = async function (enteredPassword) {
	const isMatch = await bycrypt.compare(enteredPassword, this.password)
	return isMatch
}

module.exports = mongoose.model('User', UserSchema)
