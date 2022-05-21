const express = require("express")
const cors = require("cors")
const multer = require("multer")
const app = express()
const DatauriParser = require('datauri/parser');
const cloudinary = require("cloudinary").v2;
const PORT = 3004

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

/**
 * Use upload picture lib multer
 * 
 */

const ALLOWED_FORMATS = [
    "image/jpeg",
    "image/jpg",
    "image/png"
]

// use memoryStorage for multi upload save ram
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    fileFilter: function(req, file, cb) {
        if(ALLOWED_FORMATS.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error("Not support file type"), false)
        }
    }
})

/**
 * multer sinlge upload
 */

 const singleUpload = upload.single("file");
 const singleUploadCtrl = (req, res, next) => {
   singleUpload(req, res, (error) => {
     if (error) {
       return res.status(422).send({
         message: "Image upload failed",
       });
     }
     next();
   });
 };

// use dataurl upload form buffer
const parser = new DatauriParser();
const path = require("path");
const formatBuffer = (file) => {
    return parser.format(
        path.extname(file.originalname).toString().toLowerCase(),
        file.buffer
    )
}


app.get("/api", (res, req) => {
    console.log("Hello nodejs 123")
})

// upload api
app.post("/api/upload", singleUploadCtrl, async (req, res) => {
    //axios se co request la req.body
    const uploadFile = req.body.file || req.file;
    console.log(uploadFile);
    try {
        if (!uploadFile) {
            return res.status(422).send({
            message: "There are error in uploading",
            });
        }
        let file64 = formatBuffer(uploadFile);
        console.log(file64)
        return res.json({
            // cloudinaryId: uploadResult.public_id,
            // url: uploadResult.secure_url,
            message: "upload OK",
        });
  
      // Chuyen file dang buffer sang base64
    //   let uploadResult;
    //   if (!uploadFile.buffer) {
    //     uploadResult = await cloudinaryUpload(uploadFile);
    //   } else {
    //     let file64 = formatBuffer(uploadFile);
    //     uploadResult = await cloudinaryUpload(file64.content);
    //   }
  
    //   return res.json({
    //     cloudinaryId: uploadResult.public_id,
    //     url: uploadResult.secure_url,
    //     message: "upload OK",
    //   });
    } catch (err) {
      return res.status(422).send({
        message: err.message,
      });
    }
  });
  
  app.listen(PORT, () => {
    console.log("Port is running on", PORT);
  });