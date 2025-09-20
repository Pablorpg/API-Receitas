import jwt from "jsonwebtoken"
import usuarioModel from "../models/usuarioModel.js"

export const authenticateToken = async (request, response, next) => {
    const authHeader = request.headers.authorization
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
        return response
            .status(401)
            .json({ erro: "Token não fornecido", mensagem: "Acesso não autorizado" })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const usuario = await usuarioModel.findByPk(decoded.id)
        if (!usuario) {
            return response
                .status(401)
                .json({ erro: "Usuário não encontrado", mensagem: "Token inválido" })
        }
        request.userId = decoded.id
        request.tipoUsuario = usuario.tipoUsuario
        next()
    } catch (error) {
        response.status(403).json({ erro: "Token inválido", mensagem: "Token inválido ou expirado" })
    }
}

export const restrictToAdmin = (request, response, next) => {
    if (request.tipoUsuario !== "admin") {
        return response
            .status(403)
            .json({ erro: "Acesso negado", mensagem: "Apenas administradores podem realizar esta ação" })
    }
    next()
}