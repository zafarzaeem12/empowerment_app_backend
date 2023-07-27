const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    reported_description: {
        type: String,
    },
    reported_User_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    reported_on_Types_id:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Types'
    },
    is_reported_status :{
        type: Boolean,
        default : false
    },
    post_status :{
        type: Boolean,
        default : false
    },
},
    { timestamps: true }
)
module.exports = mongoose.model("Report", ReportSchema);