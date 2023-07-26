const router = require('express').Router();
const auth = require('../middleware/Authentication');
const File = require('../middleware/ImagesandVideosData');
const { 
    Create_New_Comments,
    Get_All_Comments_on_Post
} = require('../controller/Comments')

router.post('/create_comments' ,auth , File.user , Create_New_Comments);
router.get('/get_comments' ,auth ,File.user , Get_All_Comments_on_Post );


module.exports = router