const Goals = require("../model/Goals");
const moment = require("moment");
var mongoose = require("mongoose");
const create_Goals = async (req, res, next) => {
  try {
    if (req.body.is_Checked) {
      const currentTime = new Date();
      const Data = {
        title: req.body.title,
        details: req.body.details,
        is_Checked: req.body.is_Checked,
        User_id: req.id,
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
          User_id: ids,
          title: { $regex: title }, // Filter by title
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
module.exports = {
  create_Goals,
  Get_all_Goals,
  Get_specfic_goals,
  Get_edited_goals,
  Get_deleted_goals,
};
