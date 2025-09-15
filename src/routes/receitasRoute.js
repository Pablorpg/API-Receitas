// routes/receitasRoutes.js
import { Router } from "express"
import { criarReceita, listarReceitas, buscarReceitaPorId, atualizarReceita, deletarReceita, uploadImagem } from "../controllers/receitasController.js"
import { imageUpload } from "../middlewares/imageUpload.js"

const router = Router()

// CRUD para receitas
router.post("/", criarReceita)
router.get("/", listarReceitas)
router.get("/:id", buscarReceitaPorId)
router.put("/:id", atualizarReceita)
router.delete("/:id", deletarReceita)
router.post("/:id/imagem", imageUpload.single("image"), uploadImagem)

export default router