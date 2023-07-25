const Types = require('../model/Types')

const Create_Types = async (req,res,next) => {
    const userAvator = req?.files?.blog_image?.map((data) =>
    data?.path?.replace(/\\/g, "/"));
    const main_Types = req.body.type

try{
    const data = {
        type : main_Types.charAt(0).toUpperCase() + main_Types.slice(1).toLowerCase(),
        blog_image : userAvator,
        User_id : req.body.User_id,
        Preferences_id : req.body.Preferences_id,
        description : req.body.description,
        title : req.body.title,
        long_description : req.body.long_description
    };
   // console.log(data)
    if(data.type === "Article"){
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

module.exports = {
    Create_Types
}