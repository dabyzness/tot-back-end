import { TTReview } from "../models/ttreview.js";
import { Profile } from "../models/profile.js";
import { getDataFromURL } from "./externals.js";

const create = async (req, res) => {
  try {
    const data = await getDataFromURL(req.body.url);
    req.body.ttNumLikes = data.numLikes;
    req.body.ttNumComments = data.numComments;
    req.body.staticImg = data.staticImg;
    req.body.tiktoker = data.url.split("/")[3];
    req.body.vidID = data.url.split("/")[5].split("?")[0];
    req.body.expiresAt = data.expiresAt;

    req.body.sharer = req.user.profile;

    const ttreview = await TTReview.create(req.body);
    const profile = await Profile.findByIdAndUpdate(
      req.user.profile,
      { $push: { shared: ttreview } },
      { new: true }
    );
    ttreview.sharer = profile;
    res.status(201).json(ttreview);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const index = async (req, res) => {
  try {
    const ttreviews = await TTReview.find({}).populate("sharer");
    res.status(200).json(ttreviews);
  } catch (error) {
    res.status(500).json(error);
  }
};

const show = async (req, res) => {
  try {
    const ttreview = await TTReview.findById(req.params.id).populate("sharer");
    res.status(200).json(ttreview);
  } catch (error) {
    res.status(500).json(error);
  }
};

const update = async (req, res) => {
  try {
    const ttreview = await TTReview.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate("sharer");
    res.status(200).json(ttreview);
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteTTReview = async (req, res) => {
  try {
    const ttreview = await TTReview.findByIdAndDelete(req.params.id);
    const profile = await Profile.findById(ttreview.sharer);
    profile.shared.remove({ _id: req.params.id });
    await profile.save();
    res.status(200).json(ttreview);
  } catch (error) {
    res.status(500).json(error);
  }
};

const refreshTTData = async (req, res) => {
  try {
    const { ttReviewId } = req.params;

    const { url } = await TTReview.findById(ttReviewId);

    const { staticImg, numLikes, numComments, expiresAt } =
      await getDataFromURL(url);
    console.log(expiresAt);

    const ttReview = await TTReview.findByIdAndUpdate(ttReviewId, {
      staticImg,
      numLikes,
      numComments,
      expiresAt,
    });

    res.status(200).json(ttReview);
  } catch (error) {
    res.status(500).json(error);
  }
};

export { create, index, show, update, deleteTTReview as delete, refreshTTData };
