const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
    title: {
        type: String,
        required : true
    },
    details: {
        type: String,
        required : true
    },
    is_Checked: {
        type: Boolean,
        default : false
    },
    is_Set_Reminder: {
        type:String,
        enum : ['Hourly','Daily','Weekly'],
        default: 'Hourly'
    },
    end_Date:{
        type: String
    },
    set_Time:{
        type : Object
    },
    User_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    notification_time:{
        type: String
    }
  
},
    { timestamps: true }
)
module.exports = mongoose.model("Goal", GoalSchema);