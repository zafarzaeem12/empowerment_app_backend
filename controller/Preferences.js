const Preferences = require('../model/Preferences')
const Users = require('../model/Users')

const Create_New_Preference  = async (req,res,next) => {
    const status = req.query.status;
    try{

        const check_Admin = await Users.findOne({ _id : req.body.User_id })

        if(check_Admin.role === "User") {
            return res.status(404).send({ message : "you are not admin" })
        }

        const already = await Preferences.find({  name : req.body.name })

        if(already.length > 0) {
            return res.status(404).send({ message : "Preference already added" })
        }
       
        const category = {
            name : req.body.name,
            User_id : req.body.User_id
        }
        const created_preference = await Preferences.create(category);

        res.status(200).send({
            message : "Preference Created",
            data :created_preference
        })
    }catch(err){
        res.status(404).send({
            message : "No Preference Found"
        })
    }
}

const Get_New_Preference  = async (req,res,next) => {
    try{
        const prefer_data = await Preferences.find({ status : true });
        res.status(200).send({
            total : prefer_data.length,
            message : `Total ${prefer_data.length} Preferences Fetched`,
            data : prefer_data
        })
    }catch(err){
        res.status(404).send({
            message : `No Preferences Fetched`,
            
        })
    }
}



module.exports = {
    Create_New_Preference,
    Get_New_Preference
}