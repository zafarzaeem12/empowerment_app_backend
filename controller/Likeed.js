const Preferences = require('../model/Preferences')
const Users = require('../model/Users')
const Like = require('../model/Likeed')

const Create_Likes  = async (req,res,next) => {
    try{

        const Data = {
            Liked_type : req.body.Liked_type,
            Types_id : req.body.Types_id,
            User_id : req.body.User_id
        }

        if(Data.Liked_type === "Love_Heart"){
             const liked = await Like.create(Data)
             return  res.status(200).send({
                total : Data.Liked_type === "Love_Heart",
                message : "Love_Heart Posted",
                data :liked
            })
        }

        if(Data.Liked_type === "Like"){
            const liked = await Like.create(Data)
            return res.status(200).send({
               total : Data.Liked_type === "Like",
               message : "Like Posted",
               data :liked
           })
       }

       if(Data.Liked_type === "DisLike"){
        const liked = await Like.create(Data)
       return res.status(200).send({
            total : Data.Liked_type === "DisLike",
            message : "DisLike Posted",
            data :liked
       })
   }

        const TotalLikes = await Like.countDocuments();
        console.log('object',TotalLikes)
        res.send({ total : TotalLikes })
       
    }catch(err){
        res.status(404).send({
            message : "No Preference Found"
        })
    }
}




module.exports = {
    Create_Likes
}