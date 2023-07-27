const Types = require('../model/Types');
const Comments = require('../model/Comments');
const Likes = require('../model/Likeed');
const mongoose = require('mongoose');
const Create_Types = async (req,res,next) => {
    const userAvator = req?.files?.blog_image?.map((data) =>
    data?.path?.replace(/\\/g, "/"));
    const main_Types = req.body.type
    try{
        
        const categoryIds = req.body.category.map((cat) => cat.trim());
        console.log("categoryIds",categoryIds)
        const data = {
          type: main_Types.charAt(0).toUpperCase() + main_Types.slice(1).toLowerCase(),
          blog_image: userAvator,
          User_id: req.body.User_id,
          category: categoryIds.map((data) =>  { return {Preferences : data} } ),
          description: req.body.description,
          title: req.body.title,
          long_description: req.body.long_description,
        };

    if(data.type === "Article"){
        console.log(data)
       delete data.blog_image
       const Article = await Types.create(data);
       res
       .status(200)
       .send({ 
        message : `${Article.title} Article created Successfully `,
        data : Article
    })
    }

    if(data.type === "Blog"){
        console.log("data ===========>",data)
        delete data.long_description
        const Blogging = await Types.create(data);

       
        res
        .status(200)
        .send({ 
        message : `${Blogging.title} Blog created Successfully `,
        data : Blogging
    })
     }


}catch(err){
    res.status(404).send({ message : 'no Content found'})
}
}

const Get_Post = async (req,res,next) => {
 try{

    const data =
    [
      {
        '$lookup': {
          'from': 'preferences', 
          'localField': 'category.Preferences', 
          'foreignField': '_id', 
          'as': 'Category'
        }
      }, {
        '$addFields': {
          'Category_name': {
            '$map': {
              'input': '$Category', 
              'as': 'categoryItem', 
              'in': '$$categoryItem.name'
            }
          }
        }
      }, {
        '$unset': [
          'Category', 'category'
        ]
      }, {
        '$lookup': {
          'from': 'comments', 
          'localField': '_id', 
          'foreignField': 'Types_id', 
          'as': 'User_Comments'
        }
      }, {
        '$addFields': {
          'total_Comments': {
            '$size': '$User_Comments'
          }
        }
      }, {
        '$lookup': {
          'from': 'likeds', 
          'localField': '_id', 
          'foreignField': 'Types_id', 
          'as': 'User_Liked'
        }
      }, {
        '$addFields': {
          'total_Likes': {
            '$size': '$User_Liked'
          }
        }
      }, {
        '$lookup': {
          'from': 'users', 
          'localField': 'User_id', 
          'foreignField': '_id', 
          'as': 'User_Data'
        }
      }, {
        '$unwind': {
          'path': '$User_Data'
        }
      }, {
        '$unset': [
          'User_Data.email', 'User_Data.password', 'User_Data.verification_code', 'User_Data.is_verified', 'User_Data.user_is_profile_complete', 'User_Data.user_is_forgot', 'User_Data.user_authentication', 'User_Data.user_device_token', 'User_Data.user_device_type', 'User_Data.is_profile_deleted', 'User_Data.is_notification', 'User_Data.is_Blocked', 'User_Data.createdAt', 'User_Data.updatedAt', 'User_Data.__v', 'User_Data.address', 'User_Data.city', 'User_Data.dob', 'User_Data.state', 'User_Data.role', 'User_Data.gender'
        ]
      }, {
        '$sort': {
          'createdAt': -1
        }
      }
    ]
    const User_Post = await Types.aggregate(data);
    res
    .status(200)
    .send({
      message : "Post Fetched Successfully" ,
       data : User_Post
      })

 }catch(err){
    res
    .status(404)
    .send({message : "No Post found"})
 }
}

module.exports = {
    Create_Types,
    Get_Post
}