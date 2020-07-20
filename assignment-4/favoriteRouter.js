const express = require('express')
const bodyParser = require('body-parser')

const Favorites = require('../models/favorites')

const favoriteRouter = express.Router()
favoriteRouter.use(bodyParser.json())

const authenticate = require('../authenticate')

favoriteRouter
	.route('/')
	.get(authenticate.verifyUser, function (req, res, next) {
		Favorites.find({ postedBy: req.decoded._doc._id })
			.populate('dishes')
			.populate('postedBy')
			.exec(function (err, favorites) {
				if (err) throw err
				res.json(favorites)
			})
	})

	.post(authenticate.verifyUser, function (req, res, next) {
		Favorites.findOne({ postedBy: req.decoded._doc._id }, function (err, favorite) {
			if (err) throw err
			if (!favorite) {
				Favorites.create(req.body, function (err, favorite) {
					if (err) throw err
					console.log('Favorite created!')
					favorite.postedBy = req.decoded._doc._id
					favorite.dishes.push(req.body._id)
					favorite.save(function (err, favorite) {
						if (err) throw err
						res.json(favorite)
					})
				})
			} else {
				const dish = req.body._id

				if (favorite.dishes.indexOf(dish) == -1) {
					favorite.dishes.push(dish)
				}
				favorite.save(function (err, favorite) {
					if (err) throw err
					res.json(favorite)
				})
			}
		})
	})

	.delete(authenticate.verifyUser, function (req, res, next) {
		Favorites.remove({ postedBy: req.decoded._doc._id }, function (err, resp) {
			if (err) throw err
			res.json(resp)
		})
	})

favoriteRouter.route('/:dishId').delete(authenticate.verifyUser, function (req, res, next) {
	Favorites.findOneAndUpdate(
		{ postedBy: req.decoded._doc._id },
		{ $pull: { dishes: req.params.dishId } },
		function (err, favorite) {
			if (err) throw err
			Favorites.findOne({ postedBy: req.decoded._doc._id }, function (err, favorite) {
				res.json(favorite)
			})
		},
	)
})

module.exports = favoriteRouter
