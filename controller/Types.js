const Types = require("../model/Types");
const Comments = require("../model/Comments");
const Likes = require("../model/Likeed");
const mongoose = require("mongoose");
const Preferencess = require("../model/Preferences");
const moment = require('moment')
const Create_Types = async (req, res, next) => {
  const userAvator = req?.files?.blog_image?.map((data) =>
    data?.path?.replace(/\\/g, "/")
  );
  const main_Types = req.body.type;
  try {
    const categoryIds = req.body.category.map((cat) => cat.trim());
    console.log("categoryIds", categoryIds);
    const data = {
      type:
        main_Types.charAt(0).toUpperCase() + main_Types.slice(1).toLowerCase(),
      blog_image: userAvator,
      User_id: req.body.User_id,
      category: categoryIds.map((data) => {
        return { Preferences: data };
      }),
      description: req.body.description,
      title: req.body.title,
      long_description: req.body.long_description,
    };

    if (data.type === "Article") {
      console.log(data);
      delete data.blog_image;
      const Article = await Types.create(data);
      res.status(200).send({
        message: `${Article.title} Article created Successfully `,
        data: Article,
      });
    }

    if (data.type === "Blog") {
      console.log("data ===========>", data);
      delete data.long_description;
      const Blogging = await Types.create(data);

      res.status(200).send({
        message: `${Blogging.title} Blog created Successfully `,
        data: Blogging,
      });
    }
  } catch (err) {
    res.status(404).send({ message: "no Content found" });
  }
};

const Get_Post = async (req, res, next) => {
  const id = new mongoose.Types.ObjectId(req.id);
  try {
  const data =[
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
        'current_reaction': {
          '$in': [
            id, '$User_Liked.User_id'
          ]
        }, 
        'reactions': {
          '$filter': {
            'input': '$User_Liked', 
            'as': 'reactions', 
            'cond': {
              '$eq': [
                '$$reactions.User_id', id
              ]
            }
          }
        }
      }
    }, {
      '$addFields': {
        'total_Likes': {
          '$size': '$User_Liked'
        }
      }
    }, {
      '$lookup': {
        'from': 'reports', 
        'localField': '_id', 
        'foreignField': 'reported_on_Types_id', 
        'as': 'Reported_User'
      }
    }, {
      '$lookup': {
        'from': 'saveposts', 
        'localField': '_id', 
        'foreignField': 'save_on_Types_id', 
        'as': 'savePost'
      }
    }, {
      '$addFields': {
        'On_reported_Post': '$Reported_User', 
        'is_post_saved': {
          '$in': [
            id, '$savePost.save_on_User_id'
          ]
        }, 
        'saved_posts': {
          '$filter': {
            'input': '$savePost', 
            'as': 'saved_posts', 
            'cond': {
              '$eq': [
                '$$saved_posts.save_on_User_id', id
              ]
            }
          }
        }
      }
    }, {
      '$lookup': {
        'from': 'users', 
        'localField': 'On_reported_Post.reported_User_id', 
        'foreignField': '_id', 
        'as': 'Details_for_Reported_User'
      }
    }, {
      '$match': {
        '$expr': {
          '$and': [
            {
              '$not': {
                '$in': [
                  id, '$On_reported_Post.reported_User_id'
                ]
              }
            }
          ]
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
        'User_Data.email', 'User_Data.password', 'User_Data.verification_code', 'User_Data.is_verified', 'User_Data.user_is_profile_complete', 'User_Data.user_is_forgot', 'User_Data.user_authentication', 'User_Data.user_device_token', 'User_Data.user_device_type', 'User_Data.is_profile_deleted', 'User_Data.is_notification', 'User_Data.is_Blocked', 'User_Data.createdAt', 'User_Data.updatedAt', 'User_Data.__v', 'User_Data.address', 'User_Data.city', 'User_Data.dob', 'User_Data.state', 'User_Data.role', 'reactions._id', 'reactions.Types_id', 'reactions.User_id', 'reactions.status', 'reactions.createdAt', 'reactions.updatedAt', 'reactions.__v'
      ]
    }, {
      '$sort': {
        'createdAt': -1
      }
    }
  ]
    const User_Post = await Types.aggregate(data);
    res.status(200).send({
      message: "Post Fetched Successfully",
      totalPost: User_Post.length,
      data: User_Post,
    });
  } catch (err) {
    res.status(404).send({ message: "No Post found" });
  }
};

const Get_Filter_Post = async (req, res, next) => {
  
 
  const title = req.query.title;
  const type = req.query.type;
  const createdAt =   req.query.createdAt
  const Preferences = req.query.Preferences


  try {
   

    const data = [
      {
        $lookup: {
          from: "preferences",
          localField: "category.Preferences",
          foreignField: "_id",
          as: "Selected_category",
        },
      },
      {
        $addFields: {
          by_title: {
            $regexMatch: {
              input: "$title",
              regex:  new RegExp(title),
              options: "i",
            },
          },
          by_post_type: {
            $regexMatch: {
              input: "$type",
              regex: new RegExp(type),
               options: "i",
            },
          },
          by_post_preference: {
            $map: {
              input: "$Selected_category",
              as: "category",
              in: {
                $cond: {
                  if: {
                    $regexMatch: {
                      input: "$$category.name",
                      regex: new RegExp(Preferences),
                       options: "i",
                    },
                  },
                  then: "$$category.name",
                  else: "$$REMOVE",
                },
              },
            },
          },
        },
      },
      {
        $addFields: {
          by_post_preference: {
            $filter: {
              input: "$by_post_preference",
              cond: {
                $ne: ["$$this", null],
              },
            },
          },
        },
      },
      {
        $match: {
          by_title: true,
          createdAt: {
            $gte: new Date(createdAt.toString()),
          },
          by_post_type: true,
          by_post_preference: {
            $ne: [],
          },
        },
      },
    ];

    const Filter = await Types.aggregate(data);

    !Filter.length > 0 
    ?
    res.status(404).send({ message : "Result is Empty" })
    :
    res.status(200).send({
      total : Filter.length,
      message : "Data Fetched Successfully",
      data : Filter
    })

  } catch (err) {
    res.status(404).send({
      message : err.message
    })
  }
};

module.exports = {
  Create_Types,
  Get_Post,
  Get_Filter_Post,
};
