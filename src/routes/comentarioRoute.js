import { Router } from "express"
import { editarComentario, deletarComentario } from "../controllers/comentarioController.js"
import { authenticateToken } from "../middlewares/auth.js"

const router = Router()

router.put("/:id", authenticateToken, editarComentario)
router.delete("/:id", authenticateToken, deletarComentario)

export default router