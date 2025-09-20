import { Router } from "express"
import { criarChef, listarChefs, buscarChefPorId, atualizarChef, deletarChef } from "../controllers/chefController.js"
import { authenticateToken, restrictToAdmin } from "../middlewares/auth.js"

const router = Router()

router.post("/", authenticateToken, restrictToAdmin, criarChef)
router.get("/", listarChefs)
router.get("/:id", buscarChefPorId)
router.put("/:id", authenticateToken, restrictToAdmin, atualizarChef)
router.delete("/:id", authenticateToken, restrictToAdmin, deletarChef)

export default router