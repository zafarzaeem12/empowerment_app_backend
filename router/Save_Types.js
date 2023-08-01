const router = require('express').Router();
const auth = require('../middleware/Authentication');
const File = require('../middleware/ImagesandVideosData');
const { 
    Save_Post,
    Get_All_Save_Post
} = require('../controller/Save_Types')

//router.post('/reportPost' ,auth , File.user , Report_a_Post);

router.post('/savePost' , auth , File.user , Save_Post )
router.get('/get_savePost' , auth ,Get_All_Save_Post );


module.exports = router