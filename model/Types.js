const mongoose = require('mongoose');

const  TypesSchema = new mongoose.Schema({
    User_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    category:[
                {Preferences :
                        {
                            type: mongoose.Schema.Types.ObjectId,
                            ref : 'Preferences'
                        }
                }
    ],
    description: {
        type: String,
    },
    title: {
        type: String,
    },
    status :{
        type: Boolean,
        default : true
    },
    type:{
        type:String,
        enum : ['Blog','Article','Video','Audio'],
        default: 'Article'
    },
    blog_image:{
        type : Array
    },
    long_description:{
        type : String
    }
  
},
    { timestamps: true }
)
module.exports = mongoose.model("Types", TypesSchema);