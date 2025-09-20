import { Router } from "express"
import { registrarUsuario, buscarPerfil, atualizarPerfil, buscarUsuarioPorId } from "../controllers/usuarioController.js"
import { authenticateToken } from "../middlewares/auth.js"

const router = Router()

router.post("/registro", registrarUsuario)
router.get("/perfil", authenticateToken, buscarPerfil)
router.put("/perfil", authenticateToken, atualizarPerfil)
router.get("/:id", buscarUsuarioPorId)

export default router