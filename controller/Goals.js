
//const url = https://marvelapp.com/prototype/hjb0j1b/screen/85462627
const Goals = require("../model/Goals");
const Notification = require('../model/Notification')

const moment = require("moment");
var mongoose = require("mongoose");
const cron = require('node-cron');
const push_notifications = require('../middleware/push_notification');

const create_Goals = async (req, res, next) => {
  try {
    if (req.body.is_Checked) {
      const currentTime = new Date();
      const time = moment(req.body.set_Time, "HH:mm").format("hh:mm A")
      
      const Data = {
        title: req.body.title,
        details: req.body.details,
        is_Checked: req.body.is_Checked,
        notification_time : req.body.is_Set_Reminder === "Hourly" ?
          moment(Date.now()).add(1, 'h').format('YYYY-MM-DDThh:mm A') :  
          req.body.is_Set_Reminder === "Daily" ? 
          moment(Date.now()).add(1, 'd').format('YYYY-MM-DD') + 'T' + time: 
          req.body.is_Set_Reminder === "Weekly" ?
          moment(Date.now()).add(1, 'w').format('YYYY-MM-DD') + 'T' + time : null,
        User_id: req.id,
        is_Set_Reminder: req.body.is_Set_Reminder,
        end_Date:   moment(req.body.end_Date).format('YYYY-MM-DD'),
        set_Time: req.body.is_Set_Reminder === "Hourly" ? moment(currentTime).format('YYYY-MM-DDThh:mm A').split('T').pop() : time
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
      User_id: req.id,
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

const Get_all_Goals = async (req, res) => {
  const User_id = req.id;
  const ids = new mongoose.Types.ObjectId(User_id);
  const title = new RegExp(req.query.title, "i");
  const createdAt = new Date(req.query.createdAt);


  try {
    const updated_goals = await Goals.aggregate([
      {
        $match: {
          is_Complete: false, 
          User_id : ids,
          title : { $regex: title }, // Filter by title
          createdAt: {
            $gte: createdAt,
            //  $lt: createdAt,
          },
        },
      },
    ]);

    res.status(200).send({
      message: `${updated_goals.length} Goals Fetched Successfully`,
      data: updated_goals,
    });
  } catch (err) {
    res.status(404).send({ message: "no Goal Found" });
  }
};

const Get_specfic_goals = async (req, res, next) => {
  try {
    const id = req.params.id;
    const indiviually_goals = await Goals.findOne({ _id: id });

    res.status(200).send({ message: "Goals Fetched", data: indiviually_goals });
  } catch (err) {
    res.status(404).send({ message: "no goal fetched" });
  }
};

const Get_edited_goals = async (req, res, next) => {
  try {
    const goal_id = req.params.id;
    console.log("goal_id", goal_id);
    const currentTime = new Date();
    const updated_goals = await Goals.findByIdAndUpdate(
      { _id: goal_id },
      {
        $set: {
          title: req.body.title,
          details: req.body.details,
          is_Checked: req.body.is_Checked,
          is_Set_Reminder: req.body.is_Set_Reminder,
          end_Date: req.body.end_Date,
          set_Time: {
            date: currentTime,
            offset: currentTime.getTimezoneOffset(),
          },
        },
      },
      { new: true }
    );

    res.status(200).send({
      message: "Goal Updated Successfully",
      data: updated_goals,
    });
  } catch (err) {
    res.status(404).send({
      message: "No Goal Updated",
    });
  }
};

const Get_deleted_goals = async (req, res, next) => {
  const Id = req.params.id;
  try {
    const delete_goal = await Goals.deleteOne({ _id: Id });
    const { acknowledged, deletedCount } = delete_goal;

    if (acknowledged === true && deletedCount === 1) {
      res.status(200).send({
        message: "Goal Deleted Successfully",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Goal Not Deleted",
    });
  }
};

const Goal_Notification = async (req,res,next) => {
  const currentTime = new Date()
  const userNotifiy = await Goals
  .find()
  .populate({
    path: 'User_id' , 
    select: '-user_authentication -password -user_is_forgot'
  })

 return userNotifiy.filter(async (data) => {
  
    if(data.is_Checked === true){
      const notification_time = data.notification_time.split('T').pop()
      const notification_date = data.notification_time.split('T').slice(0,1).pop()
      const corr_time = new Date()
      const current_time = moment(corr_time).format('YYYY-MM-DDThh:mm A').split('T').pop()
      const current_date  = moment(corr_time).format('YYYY-MM-DDThh:mm A').split('T').slice(0,1).pop()

     
      if( current_time  <= notification_time && current_date <=  data.end_Date &&  data.is_Set_Reminder === 'Hourly'){
          console.log("==============> , Hourly")
          const notification_obj_receiver = {
            to: data.User_id.user_device_token,
            title: data.title,
            body: data.details,
            notification_type: 'msg_notify',
            vibrate: 1,
            sound: 1,
        }
        if(data.User_id.is_notification === true && data.User_id.user_device_token != null){
          const Data = {
            User_id :data.User_id._id,
            title  :notification_obj_receiver.title,
            details : notification_obj_receiver.body
          }
          await Notification.create(Data)

        return push_notifications(notification_obj_receiver)
       
        };
        
      }
      else if(notification_date <=  data.end_Date &&  data.is_Set_Reminder === 'Daily'){
        console.log("==============> , Daily")
        const notification_obj_receiver = {
          to: data.User_id.user_device_token,
          title: data.title,
          body: data.details,
          notification_type: 'msg_notify',
          vibrate: 1,
          sound: 1,
          other: data
        };
        if(data.User_id.is_notification === true && data.User_id.user_device_token != null){
          const Data = {
            User_id :data.User_id._id,
            title  :notification_obj_receiver.title,
            details : notification_obj_receiver.body
          }
            await Notification.create(Data)
          return push_notifications(notification_obj_receiver)
        }
      }
      else if(notification_date <=  data.end_Date && data.is_Set_Reminder === 'Weekly'){
        console.log("==============> , Weekly")
        const notification_obj_receiver = {
          to: data.User_id.user_device_token,
          title: data.title,
          body: data.details,
          notification_type: 'msg_notify',
          vibrate: 1,
          sound: 1,
        };
        if(data.User_id.is_notification === true && data.User_id.user_device_token != null){
          const Data = {
            User_id :data.User_id._id,
            title  :notification_obj_receiver.title,
            details : notification_obj_receiver.body
          }
            await Notification.create(Data)
          return push_notifications(notification_obj_receiver)
        }
      }

    }else{
      console.log('object')
    }
  })
  

  // res
  // .status(200)
  // .send({
  //   message : "Notification send",
  //   data : userNotifiy
  // })

}

const Is_Goal_Compelet = async (req,res,next) => {
try{
  
  const userNotifiy = await Goals
  .find()
 

 return userNotifiy.filter(async (data) => {
  const notification_time = data.notification_time.split('T').pop()
  const notification_date = data.notification_time.split('T').slice(0,1).pop()
  const corr_time = new Date()
  const current_time = moment(corr_time).format('YYYY-MM-DDThh:mm A').split('T').pop()
  const current_date  = moment(corr_time).format('YYYY-MM-DDThh:mm A').split('T').slice(0,1).pop()

  console.log(current_date > data.end_Date )
  
  if( current_time  > notification_time && current_date >  data.end_Date &&  data.is_Set_Reminder === 'Hourly'){
    console.log("==============> , Hourly")
    const Id = data._id
    await Goals.updateMany({ _id : Id} , { $set:{is_Complete : true}} , {new :true})
  
}
else if(notification_date >  data.end_Date &&  data.is_Set_Reminder === 'Daily'){
  console.log("==============> , Daily")
  const Id = data._id
  await Goals.updateMany({ _id : Id} , { $set:{is_Complete : true}} , {new :true})
 
}
else if(notification_date >  data.end_Date && data.is_Set_Reminder === 'Weekly'){
  console.log("==============> , Weekly")
  const Id = data._id
  await Goals.updateMany({ _id : Id} , { $set:{is_Complete : true}} , {new :true})
  
}
 })

}catch(err){
  console.log(err)
}
}
const task = cron.schedule("* * * * *",( async() => {
 await Goal_Notification()
 await Is_Goal_Compelet()
  console.log("Goal_Notification()" ) 
}) ,  {
  scheduled: false, // This will prevent the immediate execution of the task
});
task.start();

// // Schedule the task to run after 1 hour
// // const oneHourFromNow = new Date();
// // oneHourFromNow.setHours(oneHourFromNow.getHours() + 1);
// // task.setTime(oneHourFromNow);

module.exports = {
  create_Goals,
  Get_all_Goals,
  Get_specfic_goals,
  Get_edited_goals,
  Get_deleted_goals,
  Goal_Notification
};
