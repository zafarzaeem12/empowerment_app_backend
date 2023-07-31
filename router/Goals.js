const router = require('express').Router();
const auth = require('../middleware/Authentication');
const File = require('../middleware/ImagesandVideosData');
const { 
    create_Goals,
    Get_all_Goals,
    Get_specfic_goals
} = require('../controller/Goals')

 router.post('/create_goals' ,auth , File.user , create_Goals );
 router.get('/get_all_goals' , auth , Get_all_Goals)
 router.get('/goal_by_id' , auth , Get_specfic_goals)
// router.get('/get_comments' ,auth ,File.user , Get_All_Comments_on_Post );


module.exports = router