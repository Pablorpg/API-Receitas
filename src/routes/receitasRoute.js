import { Router } from "express"
import { criarReceita, listarReceitas, buscarReceitaPorId, atualizarReceita, deletarReceita } from "../controllers/receitasController.js"
import { authenticateToken, restrictToAdmin } from "../middlewares/auth.js"

const router = Router()

router.post("/", authenticateToken, criarReceita)
router.get("/", listarReceitas)
router.get("/:id", buscarReceitaPorId)
router.put("/:id", authenticateToken, restrictToAdmin, atualizarReceita)
router.delete("/:id", authenticateToken, restrictToAdmin, deletarReceita)

export default router