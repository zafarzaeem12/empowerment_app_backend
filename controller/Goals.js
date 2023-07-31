const Goals = require("../model/Goals");
const moment = require("moment");
const create_Goals = async (req, res, next) => {
  try {
    if (req.body.is_Checked) {
      const currentTime = new Date();
      const Data = {
        title: req.body.title,
        details: req.body.details,
        is_Checked: req.body.is_Checked,
        User_id : req.id,
        is_Set_Reminder: req.body.is_Set_Reminder,
        end_Date: req.body.end_Date,
        set_Time: {
          date: currentTime,
          offset: currentTime.getTimezoneOffset(),
        },
      };

      const Goal = await Goals.create(Data);
      return res.status(200).send({
        message: ` ${Goal.title} created successfully`,
        data: Goal,
      });
    }
    const Data = {
      title: req.body.title,
      details: req.body.details,
      end_Date: req.body.end_Date,
      User_id : req.id,
    };

    const Goal = await Goals.create(Data);
    res.status(200).send({
      message: ` ${Goal.title} created successfully`,
      data: Goal,
    });
  } catch (err) {
    console.log(err);
  }
};

const Get_all_Goals = async (req,res) => {
    try{
        const all_Goals = await Goals.find();
        res
        .status(200)
        .send({ 
            message : `${all_Goals.length} Goals Fetched Successfully`,
            data : all_Goals
     })
    }catch(err){
        res.status(404).send({ message : "no Goal Found"})
    }
}

const Get_specfic_goals = async (req,res,next) => {
try{
    const User_id = req.id;
    const indiviually_goals =  await Goals.findOne({ User_id : User_id});

    res.status(200).send({ message : 'Goals Fetched' , data : indiviually_goals})
}catch(err){
    res.status(404).send({ message : 'no goal fetched'})
}
}
module.exports = {
  create_Goals,
  Get_all_Goals,
  Get_specfic_goals
};
