import { Router } from "express"
import { registrarUsuario, buscarPerfil, atualizarPerfil } from "../controllers/usuarioController.js"

const router = Router()

router.post("/registro", registrarUsuario)
router.get("/perfil", buscarPerfil)
router.put("/perfil", atualizarPerfil)

export default router