import { Router } from "express"
import { listarReceitas, buscarReceitaPorId } from "../controllers/receitasController.js"
import { curtirReceita, descurtirReceita, listarReceitasPopulares } from "../controllers/curtidaController.js"
import { authenticateToken } from "../middlewares/auth.js"

const router = Router()

router.get("/", listarReceitas)
router.get("/:id", buscarReceitaPorId)
router.post("/:id/curtir", authenticateToken, curtirReceita)
router.delete("/:id/curtir", authenticateToken, descurtirReceita)
router.get("/populares", authenticateToken, listarReceitasPopulares)

export default router