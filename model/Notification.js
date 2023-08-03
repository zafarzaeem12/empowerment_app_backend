const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    title: {
        type: String,
        required : true
    },
    details: {
        type: String,
        required : true
    },
    User_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
},
    { timestamps: true }
)
module.exports = mongoose.model("Notification", NotificationSchema);