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