import usuarioModel from "../models/usuarioModel.js"
import refreshTokenModel from "../models/refreshTokenModel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const login = async (request, response) => {
    try {
        const { email, senha } = request.body

        if (!email) {
            return response
                .status(400)
                .json({ erro: "Campo email inválido", mensagem: "O campo email não pode ser vazio" })
        }
        if (typeof email !== "string" || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            return response
                .status(400)
                .json({ erro: "Campo email inválido", mensagem: "O email deve ser válido" })
        }

        if (!senha) {
            return response
                .status(400)
                .json({ erro: "Campo senha inválido", mensagem: "O campo senha não pode ser vazio" })
        }

        const usuario = await usuarioModel.findOne({ where: { email } })
        if (!usuario) {
            return response
                .status(401)
                .json({ erro: "Credenciais inválidas", mensagem: "Email ou senha incorretos" })
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha)
        if (!senhaValida) {
            return response
                .status(401)
                .json({ erro: "Credenciais inválidas", mensagem: "Email ou senha incorretos" })
        }

        const accessToken = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: "15m" })
        const refreshToken = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: "7d" })

        await refreshTokenModel.create({
            token: refreshToken,
            usuarioId: usuario.id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        })

        response.status(200).json({
            success: true,
            data: {
                user: {
                    id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email,
                    tipoUsuario: usuario.tipoUsuario
                },
                accessToken,
                refreshToken,
                expiresIn: 15 * 60
            }
        })
    } catch (error) {
        response.status(500).json({ erro: "Erro ao fazer login", mensagem: error.message })
    }
}

export const logout = async (request, response) => {
    try {
        const { refreshToken } = request.body

        if (!refreshToken) {
            return response
                .status(400)
                .json({ erro: "Token não fornecido", mensagem: "O refreshToken é obrigatório" })
        }

        const token = await refreshTokenModel.findOne({ where: { token: refreshToken } })
        if (!token) {
            return response
                .status(400)
                .json({ erro: "Token inválido", mensagem: "O refreshToken fornecido não é válido" })
        }

        await token.destroy()

        response.status(200).json({ success: true, data: { mensagem: "Logout realizado com sucesso" } })
    } catch (error) {
        response.status(500).json({ erro: "Erro ao fazer logout", mensagem: error.message })
    }
}

export const refreshToken = async (request, response) => {
    try {
        const { refreshToken } = request.body

        if (!refreshToken) {
            return response
                .status(400)
                .json({ erro: "Token não fornecido", mensagem: "O refreshToken é obrigatório" })
        }

        const token = await refreshTokenModel.findOne({ where: { token: refreshToken } })
        if (!token) {
            return response
                .status(403)
                .json({ erro: "Token inválido", mensagem: "O refreshToken fornecido não é válido" })
        }

        if (token.expiresAt < new Date()) {
            await token.destroy()
            return response
                .status(403)
                .json({ erro: "Token expirado", mensagem: "O refreshToken fornecido está expirado" })
        }

        try {
            const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET)
            const usuario = await usuarioModel.findByPk(decoded.id)
            if (!usuario) {
                return response
                    .status(401)
                    .json({ erro: "Usuário não encontrado", mensagem: "O usuário associado ao token não existe" })
            }

            const newAccessToken = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: "15m" })
            const newRefreshToken = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: "7d" })

            await token.destroy()
            await refreshTokenModel.create({
                token: newRefreshToken,
                usuarioId: usuario.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            })

            response.status(200).json({
                success: true,
                data: {
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken,
                    expiresIn: 15 * 60
                }
            })
        } catch (error) {
            response.status(403).json({ erro: "Token inválido", mensagem: "O refreshToken fornecido é inválido" })
        }
    } catch (error) {
        response.status(500).json({ erro: "Erro ao renovar token", mensagem: error.message })
    }
}

export const verificarToken = async (request, response) => {
    try {
        const usuario = await usuarioModel.findByPk(request.userId)
        if (!usuario) {
            return response
                .status(401)
                .json({ erro: "Usuário não encontrado", mensagem: "Token inválido" })
        }

        response.status(200).json({
            success: true,
            data: {
                user: {
                    id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email,
                    tipoUsuario: usuario.tipoUsuario
                }
            }
        })
    } catch (error) {
        response.status(500).json({ erro: "Erro ao verificar token", mensagem: error.message })
    }
}