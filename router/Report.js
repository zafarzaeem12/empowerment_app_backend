const router = require('express').Router();
const auth = require('../middleware/Authentication');
const File = require('../middleware/ImagesandVideosData');
const { 
    Report_a_Post,
    Report_a_Comment
} = require('../controller/Report')

router.post('/reportPost' ,auth , File.user , Report_a_Post);

router.post('/reportcomments' , auth , File.user , Report_a_Comment )
// router.get('/get_comments' ,auth ,File.user , Get_All_Comments_on_Post );


module.exports = router