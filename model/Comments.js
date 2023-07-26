const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    comments: {
        type: String,
    },
    User_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    Types_id:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Types'
    },
    status :{
        type: Boolean,
        default : true
    },
  
},
    { timestamps: true }
)
module.exports = mongoose.model("Comment", CommentSchema);