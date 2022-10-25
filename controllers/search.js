import { Profile } from "../models/profile.js";
import { Restaurant } from "../models/restaurant.js";

const search = async (req, res) => {
  try {
    const { type } = req.query;
    const { searchTerm } = req.params;

    const reggie = new RegExp(`${searchTerm}`, "i");

    switch (type) {
      case "restaurant":
        const restaurantResults = await Restaurant.find({ name: reggie }).limit(
          10
        );
        res.status(200).json(restaurantResults);
        break;

      case "profile":
        const profileResults = await Profile.find({ name: reggie }).limit(10);
        res.status(200).json(profileResults);
        break;

      case "tags":
        const tagArr = searchTerm.split(",");
        tagArr.pop();
        const tagResults = await Restaurant.find({
          tags: { $in: tagArr },
        });
        res.status(200).json(tagResults);
        break;

      case "cuisine":
        const cuisineArr = searchTerm.split(",");
        cuisineArr.pop();
        const cuisineResults = await Restaurant.find({
          cuisineType: { $in: cuisineArr },
        });
        res.status(200).json(cuisineResults);
        break;
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export { search };
