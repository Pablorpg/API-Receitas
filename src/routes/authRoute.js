import { Router } from "express"
import { login, logout, refreshToken, verificarToken } from "../controllers/authController.js"
import { authenticateToken } from "../middlewares/auth.js"

const router = Router()

router.post("/login", login)
router.post("/logout", logout)
router.post("/refresh", refreshToken)
router.get("/verificar", authenticateToken, verificarToken)

export default router