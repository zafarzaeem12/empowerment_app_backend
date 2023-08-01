const savePost = require("../model/Save_Types");
var mongoose = require("mongoose");

const Save_Post = async (req, res, next) => {
  const Id = req.id;
  try {
    const Data = {
      save_on_User_id: Id,
      save_on_Types_id: req.body.save_on_Types_id,
      is_saved_status: true,
    };

    const duplicate = await savePost.find({
      $and: [
        { save_on_Types_id: req.body.save_on_Types_id },
        { is_saved_status: true },
      ],
    });

    if (duplicate.length > 0) {
      return res.status(404).send({
        message: "This Post already exists",
      });
    }

    const save_Post = await savePost.create(Data);

    res.status(200).send({
      message: "Posts saved successfully",
      data: save_Post,
    });
  } catch (err) {
    res.status(500).send({
      message: "Posts not saved",
    });
  }
};

const Get_All_Save_Post = async (req, res, next) => {
  const ids = new mongoose.Types.ObjectId(req.id);
  const limit = req.query.limit || 10;
  const skip = req.query.skip || 0;
  
  try {
    const data = [
        {
          '$match': {
            'save_on_User_id': ids
          }
        }, {
          '$lookup': {
            'from': 'types', 
            'localField': 'save_on_Types_id', 
            'foreignField': '_id', 
            'as': 'Posts'
          }
        }, {
          '$unwind': {
            'path': '$Posts'
          }
        }, {
          '$sort': {
            'createdAt': -1
          }
        }, {
          '$limit': Number(limit)
        }, {
          '$skip': Number(skip)
        }
      ]

    const All_user_post = await savePost.aggregate(data);
   
    res
      .status(200)
      .send({
        message: `your all post ${All_user_post.length} is fetched`,
        data: All_user_post,
      });
  } catch (err) {
    res.status(404).send({ message: "no posts" });
  }
};
module.exports = {
  Save_Post,
  Get_All_Save_Post,
};
