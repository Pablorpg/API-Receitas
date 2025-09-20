import usuarioModel from "../models/usuarioModel.js"

export const adminAuth = async (request, response, next) => {
    try {
        const usuarioId = request.userId

        const usuario = await usuarioModel.findByPk(usuarioId)
        if (!usuario) {
            return response
                .status(404)
                .json({ erro: "Usuário não encontrado", mensagem: "Usuário não encontrado" })
        }

        if (usuario.tipoUsuario !== "admin") {
            return response
                .status(403)
                .json({ erro: "Acesso negado", mensagem: "Apenas administradores podem realizar esta ação" })
        }

        next()
    } catch (error) {
        response.status(500).json({ erro: "Erro ao verificar permissão", mensagem: error.message })
    }
}