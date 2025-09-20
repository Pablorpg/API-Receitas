import { Router } from "express"
import { registrarUsuario, buscarPerfil, atualizarPerfil, buscarUsuarioPorId } from "../controllers/usuarioController.js"
import { listarCurtidasUsuario } from "../controllers/curtidaController.js"
import { authenticateToken, restrictToAdmin } from "../middlewares/auth.js"
import { listarComentariosUsuario } from "../controllers/comentarioController.js"

const router = Router()

router.post("/registro", authenticateToken, restrictToAdmin, registrarUsuario)
router.get("/perfil", authenticateToken, buscarPerfil)
router.put("/perfil", authenticateToken, atualizarPerfil)
router.get("/curtidas", authenticateToken, listarCurtidasUsuario)
router.get("/:id", buscarUsuarioPorId)
router.get("/comentarios", authenticateToken, listarComentariosUsuario)

export default router