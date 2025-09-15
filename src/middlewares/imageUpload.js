import multer from "multer"
import { imageStorage } from "../config/multer.js"

export const imageUpload = multer({
    storage: imageStorage,
    fileFilter: (request, file, cb) => {
        if (!file.originalname.match(/\.(png|jpg|jpeg|webp)$/i)) {
            return cb(new Error("Por favor, envie apenas jpg, jpeg, png ou webp"))
        }
        cb(null, true)
    },
    limits: {
        fileSize: 5 * 1024 * 1024
    }
})