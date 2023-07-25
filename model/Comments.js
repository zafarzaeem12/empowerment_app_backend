const mongoose = require('mongoose');

const PreferencesSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    User_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    status :{
        type: Boolean,
        default : true
    },
  
},
    { timestamps: true }
)
module.exports = mongoose.model("Preferences", PreferencesSchema);