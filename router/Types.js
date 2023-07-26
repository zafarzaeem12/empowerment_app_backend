const router = require('express').Router();
const auth = require('../middleware/Authentication');
const File = require('../middleware/ImagesandVideosData');
const { 
    Create_Types,
    Get_Post
} = require('../controller/Types')

router.post('/create_types' ,auth , File.upload , Create_Types);
router.get('/get' ,auth , File.upload , Get_Post);




module.exports = router