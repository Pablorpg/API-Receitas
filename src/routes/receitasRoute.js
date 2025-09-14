// routes/receitasRoutes.js
import { Router } from "express"
import { criarReceita, listarReceitas, buscarReceitaPorId, atualizarReceita, deletarReceita, } from "../controllers/receitasController.js"

const router = Router()

// CRUD para receitas
router.post("/", criarReceita)
router.get("/", listarReceitas)
router.get("/:id", buscarReceitaPorId)
router.put("/:id", atualizarReceita)
router.delete("/:id", deletarReceita)

export default router