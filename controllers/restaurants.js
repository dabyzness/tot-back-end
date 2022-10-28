import { Profile } from "../models/profile.js";
import { Restaurant } from "../models/restaurant.js";
import { scrapeGoogle } from "./externals.js";

const create = async (req, res) => {
  try {
    const { url } = req.body;
    const data = await scrapeGoogle(url);

    if (!data.imgs.length) {
      throw new Error({ error: "Invalid URL" });
    }

    const restaurant = await Restaurant.create(data);
    res.status(201).json(restaurant);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const index = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({});
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json(error);
  }
};

const show = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
      .populate({
        path: "ratings",
        model: "Ratings",
        populate: {
          path: "author",
          model: "Profile",
        },
      })
      .populate("ttreviews");
    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json(error);
  }
};

const update = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json(error);
  }
};

const createRating = async (req, res) => {
  try {
    req.body.author = req.user.profile;
    const restaurant = await Restaurant.findById(req.params.id);
    restaurant.ratings.push(req.body);
    await restaurant.save();
    const author = await Profile.findById(req.user.profile);
    author.visited.push(restaurant);
    await author.save();
    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json(error);
  }
};

const showRating = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    const ratingdata = restaurant.ratings.id(req.params.ratingid);
    res.status(200).json(ratingdata);
  } catch (error) {
    res.status(500).json(error);
  }
};

const updateRating = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
      .populate("ratings.author")
      .populate("ttreviews");
    const rating = restaurant.ratings.id(req.params.ratingid);
    rating.comment = req.body.comment;
    rating.rating = req.body.rating;
    await restaurant.save();

    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteRating = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, {
      $pull: {
        ratings: { _id: req.params.ratingid },
      },
    });
    const author = await Profile.findById(req.user.profile);
    author.visited.pull(req.params.id);
    author.save();
    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json(error);
  }
};

export {
  create,
  index,
  show,
  update,
  deleteRestaurant as delete,
  createRating,
  showRating,
  updateRating,
  deleteRating,
};
