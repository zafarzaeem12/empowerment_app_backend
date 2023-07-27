const Report = require('../model/Report')
var mongoose = require('mongoose');

const Create_New_Comments  = async (req,res,next) => {
    try{

       const data = {
        reported_description : req.body.reported_description,
        reported_User_id : req.body.reported_User_id,
        reported_on_Types_id : req.body.reported_on_Types_id,
        is_reported_status : true
       }

       const create_report = await Report.create(data)

        res.status(200).send({
            message : "Report on Post Successful",
            data :create_report
        })
    }catch(err){
        res.status(404).send({
            message : "No Report Found"
        })
    }
}



module.exports = {
    Create_New_Comments
}