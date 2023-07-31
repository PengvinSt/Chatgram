const multer = require('multer');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'images/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random()*1000)
      cb(null, file.originalname + '-' + uniqueSuffix)
    }
  })

  const types = ['image/png','image/jpeg','image/jpg']

  const fileFilter = (req, file, cb)=>{
    if(types.includes(file.mimetype)){
        cb(null, true)
    } else {
        cb(null, false)
    }
  }

  module.exports = multer({storage, fileFilter})