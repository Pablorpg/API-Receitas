import jwt from "jsonwebtoken"

export const authenticateToken = (request, response, next) => {
    const authHeader = request.headers.authorization
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
        return response
            .status(401)
            .json({ erro: "Token não fornecido", mensagem: "Acesso não autorizado" })
    }

    try {
        const decoded = jwt.verify(token, "segredo_super_secreto")
        request.userId = decoded.id
        next()
    } catch (error) {
        response.status(403).json({ erro: "Token inválido", mensagem: "Token inválido ou expirado" })
    }
}