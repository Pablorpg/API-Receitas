import multer from "multer"
import { imageStorage } from "../config/multer.js"

export const imageUpload = multer({
    storage: imageStorage,
    fileFilter: (request, file, cb) => {
        const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"]
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error("Formato inválido. Envie apenas jpg, jpeg, png ou webp"))
        }
        cb(null, true)
    },
    limits: {
        fileSize: 5 * 1024 * 1024,
    }
})
