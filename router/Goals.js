const router = require('express').Router();
const auth = require('../middleware/Authentication');
const File = require('../middleware/ImagesandVideosData');
const { 
    create_Goals,
    Get_all_Goals,
    Get_specfic_goals,
    Get_edited_goals,
    Get_deleted_goals
} = require('../controller/Goals')

 router.post('/create_goals' ,auth , File.user , create_Goals );
 router.get('/get_all_user_goals' , auth , File.user , Get_all_Goals);
 router.get('/goal_by_id/:id' , auth , Get_specfic_goals);
 router.put('/edit_goal/:id' , auth , File.user , Get_edited_goals);
 router.delete('/delete_id/:id' , auth , Get_deleted_goals);



module.exports = router