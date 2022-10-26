import { Profile } from '../models/profile.js'

function index(req, res) {
  Profile.find({})
  .then(profiles => res.json(profiles))
  .catch(err => {
    console.log(err)
    res.status(500).json(err)
  })
}

function show(req, res) {
  Profile.findById(req.params.id)
  .populate('shared')
  .populate('visited')
  .populate('followers')
  .populate('following')
  .populate('wishlist')
  .then(profile => res.json(profile))
  .catch(err => {
    console.log(err)
    res.status(500).json(err)
  })
}

function follow(req,res){
  Profile.findById(req.params.id)
  .then(profile => {
    profile.followers.push(req.user.profile)
    profile.save()
    .then(savedProfile=>{
      Profile.findById(req.user.profile)
      .then(currentProfile => {
        currentProfile.following.push(savedProfile._id)
        currentProfile.save()
        .then(()=>{
          res.json(savedProfile)
        })
      })
    })
  })
  .catch(err => {
    console.log(err)
    res.status(500).json(err)
  })
}

function unfollow(req,res){
  Profile.findById(req.params.id)
  .then(profile => {
    const index = profile.followers.indexOf(req.user.profile)
    console.log(index)
    profile.followers.splice(index,1)
    profile.save()
    .then(savedProfile=>{
      Profile.findById(req.user.profile)
      .then(currentProfile => {
        const idx = currentProfile.following.indexOf(savedProfile._id)
        console.log(idx)
        currentProfile.following.splice(idx,1)
        currentProfile.save()
        .then(()=>{
          res.json(savedProfile)
        })
      })
    })
  })
  .catch(err => {
    console.log(err)
    res.status(500).json(err)
  })
}

export { 
  index,
  show,
  follow,
  unfollow,
}
