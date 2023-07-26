const mongoose = require('mongoose');

const LikedSchema = new mongoose.Schema({

    Liked_type:{
        type:String,
        enum : ['Love_Heart','Like' , 'DisLike','none'],
        default: 'none'
    },
    Types_id:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Types'
    },
    User_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    status:{
        type : Boolean,
        default : true
    }
  
},
    { timestamps: true }
)
module.exports = mongoose.model("Liked", LikedSchema);