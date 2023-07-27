const Report = require("../model/Report");
var mongoose = require("mongoose");

const Report_a_Post = async (req, res, next) => {
  try {
    const data = {
      reported_description: req.body.reported_description,
      reported_User_id: req.body.reported_User_id,
      reported_on_Types_id: req.body.reported_on_Types_id,
      is_reported_status: true,
    };

    const create_report = await Report.create(data);

    res.status(200).send({
      message: "Report on Post Successful",
      data: create_report,
    });
  } catch (err) {
    res.status(404).send({
      message: "No Report Found",
    });
  }
};

const Report_a_Comment = async (req, res, next) => {
  try {
    const Data = {
        reported_description: req.body.reported_description,
        reported_User_id: req.body.reported_User_id,
        reported_on_Types_id: req.body.reported_on_Types_id,
        reported_comments : req.body.reported_comments,
        is_Comment_reported_status : true

    }
    const create_reported_comments = await Report.create(Data);

    res
    .status(200)
    .send({ 
        message : 'Comment reported Successfully',
        data : create_reported_comments 
    })

  } catch (err) {
    res
    .status(404)
    .send({ 
        message : 'No Comment report'
    })
  }
};

module.exports = {
  Report_a_Post,
  Report_a_Comment,
};
