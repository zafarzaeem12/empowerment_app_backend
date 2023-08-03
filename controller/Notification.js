const Notification = require('../model/Notification')


const Get_all_Notification = async (req,res,next) => {
    const limit = req.query.limit || 10;
    const skip = req.query.skip || 0
    try{
        const notifyUser =  await Notification.find({ User_id : req.id}).limit(limit).skip(skip)
        const total = await Notification.countDocuments({ User_id : req.id})
        res
        .status(200)
        .send({ 
            total : total,
            Usertotal : notifyUser.length,
            message : "Notification Fetched Successfully",
            data : notifyUser
         })
    }catch(err){
        res.status(404).send({ message : "Not found"})
    }
}


module.exports = {
    Get_all_Notification
}