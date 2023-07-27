const Comments = require('../model/Comments')
var mongoose = require('mongoose');

const Create_New_Comments  = async (req,res,next) => {
    try{

       const data = {
        comments : req.body.comments,
        User_id : req.body.User_id,
        Types_id : req.body.Types_id
       }

       const create_comments = await Comments.create(data)

        res.status(200).send({
            message : "Comment Created",
            data :create_comments
        })
    }catch(err){
        res.status(404).send({
            message : "No Comment Found"
        })
    }
}

const Get_All_Comments_on_Post  = async (req,res,next) => {
  const login_user = req.id
  const ids = new mongoose.Types.ObjectId(login_user);

    try{

     

     const data =  [
      {
        '$lookup': {
          'from': 'users', 
          'localField': 'User_id', 
          'foreignField': '_id', 
          'as': 'Comment_User'
        }
      }, {
        '$unwind': {
          'path': '$Comment_User'
        }
      }, {
        '$lookup': {
          'from': 'reports', 
          'localField': '_id', 
          'foreignField': 'reported_comments', 
          'as': 'reported_comments'
        }
      }, {
        '$match': {
          '$expr': {
            '$and': [
              {
                '$not': {
                  '$in': [
                    ids, '$reported_comments.reported_User_id'
                  ]
                }
              }
            ]
          }
        }
      }, {
        '$unset': [
          'updatedAt', '__v', 'User_id', 'status', 'Comment_User.email', 'Comment_User.password', 'Comment_User.gender', 'Comment_User.verification_code', 'Comment_User.user_is_forgot', 'Comment_User.user_authentication', 'Comment_User.user_device_token', 'Comment_User.user_device_type', 'Comment_User.is_notification', 'Comment_User.createdAt', 'Comment_User.updatedAt', 'Comment_User.__v', 'Comment_User.address', 'Comment_User.city', 'Comment_User.dob', 'Comment_User.state', 'Comment_User.role', 'Comment_User.is_verified', 'Comment_User.user_is_profile_complete', 'Comment_User.is_Blocked', 'Comment_User.is_profile_deleted'
        ]
      }, {
        '$sort': {
          'createdAt': -1
        }
      }
    ]
        const comment_data = await Comments.aggregate(data);
        res.status(200).send({
            total : comment_data.length,
            message : `Total ${comment_data.length} Comments Fetched`,
            data : comment_data
        })
    }catch(err){
        res.status(404).send({
            message : `No Preferences Fetched`,
            
        })
    }
}



module.exports = {
    Create_New_Comments,
    Get_All_Comments_on_Post
}