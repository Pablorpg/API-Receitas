import { Router } from "express"
import { adicionarFavorita, listarFavoritas, removerFavorita, buscarFavoritaPorId, listarTodasFavoritas, estatisticasFavoritas } from "../controllers/favoritaController.js"
import { authenticateToken, restrictToAdmin } from "../middlewares/auth.js"

const router = Router()

router.post("/", authenticateToken, adicionarFavorita)
router.get("/", authenticateToken, listarFavoritas)
router.get("/:id", authenticateToken, buscarFavoritaPorId)
router.delete("/:id", authenticateToken, removerFavorita)
router.get("/admin/favoritas", authenticateToken, restrictToAdmin, listarTodasFavoritas)
router.get("/estatisticas", authenticateToken, estatisticasFavoritas)

export default router