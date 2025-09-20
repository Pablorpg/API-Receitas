import { Router } from "express"
import { adicionarFavorita, listarFavoritas, removerFavorita, buscarFavoritaPorId } from "../controllers/favoritaController.js"
import { authenticateToken } from "../middlewares/auth.js"

const router = Router()

router.post("/", authenticateToken, adicionarFavorita)
router.get("/", authenticateToken, listarFavoritas)
router.get("/:id", authenticateToken, buscarFavoritaPorId)
router.delete("/:id", authenticateToken, removerFavorita)

export default router