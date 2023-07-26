const Preferences = require("../model/Preferences");
const Users = require("../model/Users");
const Like = require("../model/Likeed");
var mongoose = require('mongoose');
const Create_Likes = async (req, res, next) => {
  try {
    const Data = {
      Liked_type: req.body.Liked_type,
      Types_id: req.body.Types_id,
      User_id: req.body.User_id,
    };
    
    const check_like = await Like.findOne({ 
      Types_id: req.body.Types_id,
      User_id: req.body.User_id,
    });

    if (check_like) { 
      const updated_reaction = await Like.findByIdAndUpdate(
        { _id: check_like._id },
        { $set: { Liked_type: req.body.Liked_type } },
        { new: true }
      );
      const { acknowledged, modifiedCount } = updated_reaction;
      if (acknowledged === true && modifiedCount === 1) {
        return res.status(200).send({ message: "your reaction updated" });
      }
    } else {
      const liked = await Like.create(Data);
      return res.status(200).send({
        total: Data.Liked_type,
        message: "Love_Heart Posted",
        data: liked,
      });
    }

  

    const TotalLikes = await Like.countDocuments();
    // console.log('object',TotalLikes)
    res.send({ total: TotalLikes });
  } catch (err) {
    res.status(404).send({
      message: "No Reactions Found",
      err: err.message,
    });
  }
};

const Get_Likes = async (req, res, next) => {
    const post_id = req.query.Types_id
    const id = new mongoose.Types.ObjectId(post_id);
  try {
    const data =[
        {
          '$match': {
            'Types_id': id
          }
        }, {
          '$lookup': {
            'from': 'users', 
            'localField': 'User_id', 
            'foreignField': '_id', 
            'as': 'Liked_users'
          }
        }, {
          '$unwind': {
            'path': '$Liked_users'
          }
        }, {
          '$unset': [
            'User_id', 'Liked_users.email', 'Liked_users.password', 'Liked_users.gender', 'Liked_users.verification_code', 'Liked_users.user_is_forgot', 'Liked_users.user_authentication', 'Liked_users.user_device_token', 'Liked_users.user_device_type', 'Liked_users.is_notification', 'Liked_users.createdAt', 'Liked_users.updatedAt', 'Liked_users.__v', 'Liked_users.address', 'Liked_users.city', 'Liked_users.dob', 'Liked_users.state', 'Liked_users.role', 'Liked_users.is_verified', 'Liked_users.user_is_profile_complete', 'Liked_users.is_Blocked', 'Liked_users.is_profile_deleted'
          ]
        }, {
          '$sort': {
            'createdAt': -1
          }
        }
      ]

    const get_Data = await Like.aggregate(data);

    res.status(200).send({
      message: "Likes fetched",
      total : get_Data.length,
      data: get_Data,
    });
  } catch (err) {}
};

module.exports = {
  Create_Likes,
  Get_Likes,
};
