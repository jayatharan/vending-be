const multer = require("multer")
const path = require('path');

const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./images")
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "--" + file.originalname)
    },
});

const imageFilter = function(req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        req.error = true
        //return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

const upload = multer({ 
    storage: fileStorageEngine,
    fileFilter: imageFilter
})

module.exports = { upload }