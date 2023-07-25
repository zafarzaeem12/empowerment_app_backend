const router = require('express').Router();
const auth = require('../middleware/Authentication');
const File = require('../middleware/ImagesandVideosData');
const { 
    Create_Types
} = require('../controller/Types')

router.post('/create_types' ,auth , File.upload , Create_Types);



module.exports = router