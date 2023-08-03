const router = require('express').Router();
const auth = require('../middleware/Authentication');
const File = require('../middleware/ImagesandVideosData');
const { 
    Get_all_Notification
} = require('../controller/Notification')


router.get('/get_all_user_notification' , auth , Get_all_Notification);





module.exports = router