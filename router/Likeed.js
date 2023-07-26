const router = require('express').Router();
const auth = require('../middleware/Authentication');
const File = require('../middleware/ImagesandVideosData');
const { 
    Create_Likes,
    Get_Likes
} = require('../controller/Likeed')

router.post('/createlikes' ,auth , File.user , Create_Likes);
router.get('/get' ,auth , Get_Likes )
// router.post('/like/types/:id' ,auth , File.user , Create_Likes);
// router.get('/get_preference' ,auth ,File.user , Get_New_Preference );


module.exports = router