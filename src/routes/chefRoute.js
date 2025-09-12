import { Router } from "express"
import { criarChef, listarChefs, buscarChefPorId, atualizarChef, deletarChef } from "../controllers/chefController.js"

const router = Router()

router.post("/", criarChef)
router.get("/", listarChefs)
router.get("/:id", buscarChefPorId)
router.put("/:id", atualizarChef)
router.delete("/:id", deletarChef)

export default router