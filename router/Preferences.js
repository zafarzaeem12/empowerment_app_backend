const router = require('express').Router();
const auth = require('../middleware/Authentication');
const File = require('../middleware/ImagesandVideosData');
const { 
    Create_New_Preference,
    Get_New_Preference
} = require('../controller/Preferences')

router.post('/create_preference' ,auth , File.user , Create_New_Preference);
router.get('/get_preference' ,auth ,File.user , Get_New_Preference );


module.exports = router