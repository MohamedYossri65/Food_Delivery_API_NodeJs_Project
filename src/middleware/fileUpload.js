import multer from "multer";
import AppError from "../utils/AppError.js";


let option = (fileName) => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `uploads/${fileName}`)
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null, uniqueSuffix + '-' + file.originalname)
        }
    })
    function fileFilter(req, file, cb) {
        if (file.mimetype.startsWith('image')) {
            cb(null, true)
        } else {
            cb(new AppError('images only', 404), false)
        }
    }
    return multer({ storage, fileFilter })
}
const uploadSingleFile = (fileName, fieldName) => {

    return option(fileName).single(fieldName);
}
const uploadMixOfFiles = (fileName, arrayOfFields) => {

    return option(fileName).fields(arrayOfFields)
}

export { uploadSingleFile, uploadMixOfFiles }