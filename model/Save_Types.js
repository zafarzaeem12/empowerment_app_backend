const mongoose = require('mongoose');

const SavepostSchema = new mongoose.Schema({
    save_on_User_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    save_on_Types_id:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Types'
    },
    is_saved_status :{
        type: Boolean,
        default : false
    },
},
    { timestamps: true }
)
module.exports = mongoose.model("Savepost", SavepostSchema);