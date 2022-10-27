import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ttReviewSchema = new Schema(
  {
    url: String,
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
    },
    sharer: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Profile",
      },
    ],
    ttNumLikes: String,
    ttNumComments: String,
    staticImg: String,
    tiktoker: String,
    vidID: { type: String, unique: true },
    expiresAt: Number,
  },
  {
    timestamps: true,
  }
);

const TTReview = mongoose.model("TTReview", ttReviewSchema);

export { TTReview };
