import usuarioModel from "../models/usuarioModel.js"

export const registrarUsuario = async (request, response) => {
    try {
        const { nome, email, senha, funcao } = request.body

        if (!nome) {
            return response
                .status(400)
                .json({ erro: "Campo nome inválido", mensagem: "O campo nome não pode ser vazio" })
        }
        if (typeof nome !== "string" || nome.length < 3 || nome.length > 100) {
            return response
                .status(400)
                .json({ erro: "Campo nome inválido", mensagem: "O nome deve ser uma string com 3 a 100 caracteres" })
        }

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
        if (typeof senha !== "string" || senha.length < 6) {
            return response
                .status(400)
                .json({ erro: "Campo senha inválido", mensagem: "A senha deve ter pelo menos 6 caracteres" })
        }

        if (funcao && !["admin", "comun"].includes(funcao)) {
            return response
                .status(400)
                .json({ erro: "Campo funcao inválido", mensagem: "A função deve ser 'admin' ou 'comun'" })
        }

        const usuarioExistente = await usuarioModel.findOne({ where: { email } })
        if (usuarioExistente) {
            return response
                .status(400)
                .json({ erro: "Email já está em uso", mensagem: "O email fornecido já está registrado" })
        }

        const novoUsuario = await usuarioModel.create({
            nome,
            email,
            senha,
            funcao: funcao || "comun"
        })

        response.status(201).json({ mensagem: "Usuário registrado com sucesso!", usuario: {
            id: novoUsuario.id,
            nome: novoUsuario.nome,
            email: novoUsuario.email,
            funcao: novoUsuario.funcao,
            created_at: novoUsuario.created_at
        } })
    } catch (error) {
        response.status(400).json({ erro: "Erro ao registrar usuário", mensagem: error.message })
    }
}