import { Profile } from "../models/profile.js";

function index(req, res) {
  Profile.find({})
    .then((profiles) => res.json(profiles))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
}

function show(req, res) {
  Profile.findById(req.params.id)
    .populate("shared")
    .populate("visited")
    .populate("followers")
    .populate("following")
    .populate("wishlist")
    .then((profile) => res.json(profile))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
}

const follow = async (req, res) => {
  try {
    const { id } = req.params;

    const profileToFollow = await Profile.findById(id);
    const profileThatIsFollowing = await Profile.findById(req.user.profile);

    profileToFollow.followers.push(req.user.profile);
    profileThatIsFollowing.following.push(profileToFollow);

    const profileFollowed = await (
      await profileToFollow.save()
    ).populate("followers");

    const profileFollowing = await (
      await profileThatIsFollowing.save()
    ).populate("following");

    res.status(200).json({
      followed: profileFollowed.followers,
      following: profileFollowing.following,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const unfollow = async (req, res) => {
  try {
    const { id } = req.params;

    const profileToFollow = await Profile.findById(id);
    const profileThatIsFollowing = await Profile.findById(req.user.profile);

    profileToFollow.followers.pull(req.user.profile);
    profileThatIsFollowing.following.pull(profileToFollow);

    const profileFollowed = await (
      await profileToFollow.save()
    ).populate("followers");

    const profileFollowing = await (
      await profileThatIsFollowing.save()
    ).populate("following");

    res.status(200).json({
      followed: profileFollowed.followers,
      following: profileFollowing.following,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const addToWishlist = async (req, res) => {
  try {
    const { profileId, ttReviewId } = req.params;

    const profile = await Profile.findById(profileId);

    profile.wishlist.push(ttReviewId);

    const savedProfile = await (await profile.save()).populate("wishlist");

    res.status(200).json({ wishlist: savedProfile.wishlist });
  } catch (error) {
    res.status(500).json(error);
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const { profileId, ttReviewId } = req.params;

    const profile = await Profile.findById(profileId);

    profile.wishlist.pull(ttReviewId);

    const savedProfile = await (await profile.save()).populate("wishlist");

    res.status(200).json({ wishlist: savedProfile.wishlist });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export { index, show, follow, unfollow, addToWishlist, removeFromWishlist };
