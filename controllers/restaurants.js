import { Restaurant } from '../models/restaurant.js'

const create = async (req, res) => {
  try {
    const restaurant = await Restaurant.create(req.body)
    res.status(201).json(restaurant)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

const index = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({})
    res.status(200).json(restaurants)
  } catch (error) {
    res.status(500).json(error)
  }
}

const show = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
    res.status(200).json(restaurant)
  } catch (error) {
    res.status(500).json(error)
  }
}

const update = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    res.status(200).json(restaurant)
  } catch (error) {
    res.status(500).json(error)
  }
}

const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id)
    res.status(200).json(restaurant)
  } catch (error) {
    res.status(500).json(error)
  }
}

const createRating = async (req,res) => {
  try {
    req.body.author = req.user.profile
    const restaurant = await Restaurant.findById(req.params.id)
    restaurant.ratings.push(req.body)
    await restaurant.save()
    res.status(200).json(restaurant)
  } catch (error) {
    res.status(500).json(error)
  }
}


export {
  create,
  index,
  show,
  update,
  deleteRestaurant as delete,
  createRating
}