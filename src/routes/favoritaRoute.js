import { Router } from "express"
import { adicionarFavorita, listarFavoritas } from "../controllers/favoritaController.js"
import { authenticateToken } from "../middlewares/auth.js"

const router = Router()

router.post("/", authenticateToken, adicionarFavorita)
router.get("/", authenticateToken, listarFavoritas)

export default router