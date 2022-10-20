import mongoose from 'mongoose'

const Schema = mongoose.Schema

const restaurantSchema = new Schema({
  name: String,
  location: String,
  website: String,
  cuisineType: [String],
  tags: [String],
  ttreviews: { 
    type: Schema.Types.ObjectId, 
    ref: 'TTReview' },
  sharer: { 
    type: Schema.Types.ObjectId, 
    ref: 'Profile' },
  likes: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Profile' }],
  tiktoker: String
},{
  timestamps: true,
})

const TTReview = mongoose.model('TTReview', ttReviewSchema)

export { TTReview }