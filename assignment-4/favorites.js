const mongoose = require('mongoose')

const Schema = mongoose.Schema

const favoriteSchema = new Schema(
	{
		dishes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Dish',
			},
		],
		postedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	},
	{
		timestamps: true,
	},
)

const Favorites = mongoose.model('Favorites', favoriteSchema)

module.exports = Favorites
