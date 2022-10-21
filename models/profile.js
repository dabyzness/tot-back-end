import mongoose from 'mongoose'

const Schema = mongoose.Schema

const profileSchema = new Schema({
  name: {
    type: String,
    require: true},
  photo: {
    type: String,
    require: true},
  shared: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'TTReview' }],
  wishlist: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'TTReview' }],
  visited: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Restaurant' }],
  followers: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Profile' }],
  following: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Profile' }],
  tots: Number
},{
  timestamps: true,
})

const Profile = mongoose.model('Profile', profileSchema)

export { Profile }
