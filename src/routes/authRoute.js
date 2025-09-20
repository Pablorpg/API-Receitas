import { Router } from "express"
import { login, logout, refreshToken } from "../controllers/authController.js"

const router = Router()

router.post("/login", login)
router.post("/logout", logout)
router.post("/refresh", refreshToken)

export default router