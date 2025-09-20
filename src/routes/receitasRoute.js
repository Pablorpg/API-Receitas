import { Router } from "express"
import { listarReceitas, buscarReceitaPorId } from "../controllers/receitasController.js"
import { curtirReceita, descurtirReceita, listarReceitasPopulares } from "../controllers/curtidaController.js"
import { criarComentario, listarComentariosReceita, obterMediaAvaliacao } from "../controllers/comentarioController.js"
import { authenticateToken } from "../middlewares/auth.js"

const router = Router()

router.get("/", listarReceitas)
router.get("/:id", buscarReceitaPorId)
router.post("/:id/curtir", authenticateToken, curtirReceita)
router.delete("/:id/curtir", authenticateToken, descurtirReceita)
router.get("/populares", authenticateToken, listarReceitasPopulares)
router.post("/:id/comentarios", authenticateToken, criarComentario)
router.get("/:id/comentarios", listarComentariosReceita)
router.get("/:id/avaliacao", obterMediaAvaliacao)

export default router