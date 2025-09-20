import { Router } from "express"
import { editarComentario, deletarComentario, moderarComentario } from "../controllers/comentarioController.js"
import { authenticateToken } from "../middlewares/auth.js"
import { adminAuth } from "../middlewares/adminAuth.js"

const router = Router()

router.put("/:id", authenticateToken, editarComentario)
router.delete("/:id", authenticateToken, deletarComentario)
router.put("/:id/moderar", authenticateToken, adminAuth, moderarComentario)

export default router