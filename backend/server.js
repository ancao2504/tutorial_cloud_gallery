const express = require("express")
const cors = require("cors")
const multer = require("multer")
const app = express()
const PORT = 3002

app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(cors())

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

const singleUpload = upload.single('formFile')
const singleUploadControl = (req, res, next) => {
    singleUpload(req, res, (error) => {
        if(error) {
            return res.status(442).send({
                message: "Image upload failed"
            });
        }
        next();
    });
}





app.get("/api", (res, req) => {
    console.log("Hello nodejs")
})

// upload api
app.post("api/upload", singleUploadControl, (req, res) => {
    console.log(req.file)
    return res.send({
        message: "Image send"
    })
})

app.listen(PORT, () => {
    console.log(`Server running port: ${PORT}`)
})