const mongoose = require('mongoose')
const Schema = mongoose.Schema

const leadershipSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
		},
		image: {
			type: String,
			required: true,
		},
		designation: {
			type: String,
			default: '',
		},
		abbr: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		featured: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	},
)

const Leaders = mongoose.model('Leadership', leadershipSchema)

module.exports = Leaders
