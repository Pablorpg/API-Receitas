import usuarioModel from "../models/usuarioModel.js"
import bcrypt from "bcrypt"

export const registrarUsuario = async (request, response) => {
    try {
        const { nome, email, senha, tipoUsuario } = request.body

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
        if (typeof senha !== "string" || !senha.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)) {
            return response
                .status(400)
                .json({ erro: "Campo senha inválido", mensagem: "A senha deve ter pelo menos 8 caracteres, com uma letra maiúscula, uma minúscula, um número e um caractere especial" })
        }

        if (tipoUsuario && !["admin", "comun"].includes(tipoUsuario)) {
            return response
                .status(400)
                .json({ erro: "Campo tipoUsuario inválido", mensagem: "O tipo de usuário deve ser 'admin' ou 'comun'" })
        }

        if (tipoUsuario === "admin" && request.tipoUsuario !== "admin") {
            return response
                .status(403)
                .json({ erro: "Acesso negado", mensagem: "Apenas administradores podem criar usuários admin" })
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
            tipoUsuario: tipoUsuario || "comun"
        })

        response.status(201).json({ mensagem: "Usuário registrado com sucesso!", usuario: {
            id: novoUsuario.id,
            nome: novoUsuario.nome,
            email: novoUsuario.email,
            tipoUsuario: novoUsuario.tipoUsuario,
            created_at: novoUsuario.created_at
        } })
    } catch (error) {
        response.status(400).json({ erro: "Erro ao registrar usuário", mensagem: error.message })
    }
}

export const buscarPerfil = async (request, response) => {
    try {
        const usuario = await usuarioModel.findByPk(request.userId)
        if (!usuario) {
            return response
                .status(404)
                .json({ erro: "Usuário não encontrado", mensagem: "Nenhum usuário encontrado com este ID" })
        }

        response.status(200).json({ mensagem: "Perfil encontrado!", usuario: {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            tipoUsuario: usuario.tipoUsuario,
            created_at: usuario.created_at,
            updated_at: usuario.updated_at
        } })
    } catch (error) {
        response.status(500).json({ erro: "Erro ao buscar perfil", mensagem: error.message })
    }
}

export const atualizarPerfil = async (request, response) => {
    try {
        const { nome, senha, tipoUsuario } = request.body

        const usuario = await usuarioModel.findByPk(request.userId)
        if (!usuario) {
            return response
                .status(404)
                .json({ erro: "Usuário não encontrado", mensagem: "Nenhum usuário encontrado com este ID" })
        }

        if (nome && (typeof nome !== "string" || nome.length < 3 || nome.length > 100)) {
            return response
                .status(400)
                .json({ erro: "Campo nome inválido", mensagem: "O nome deve ser uma string com 3 a 100 caracteres" })
        }

        if (senha && (typeof senha !== "string" || !senha.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/))) {
            return response
                .status(400)
                .json({ erro: "Campo senha inválido", mensagem: "A senha deve ter pelo menos 8 caracteres, com uma letra maiúscula, uma minúscula, um número e um caractere especial" })
        }

        if (tipoUsuario && !["admin", "comun"].includes(tipoUsuario)) {
            return response
                .status(400)
                .json({ erro: "Campo tipoUsuario inválido", mensagem: "O tipo de usuário deve ser 'admin' ou 'comun'" })
        }

        if (tipoUsuario && tipoUsuario !== usuario.tipoUsuario && request.tipoUsuario !== "admin") {
            return response
                .status(403)
                .json({ erro: "Acesso negado", mensagem: "Apenas administradores podem alterar o tipo de usuário" })
        }

        usuario.nome = nome || usuario.nome
        usuario.senha = senha || usuario.senha
        usuario.tipoUsuario = tipoUsuario || usuario.tipoUsuario

        await usuario.save()

        response.status(200).json({ mensagem: `Perfil de ${usuario.nome} atualizado com sucesso!`, usuario: {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            tipoUsuario: usuario.tipoUsuario,
            created_at: usuario.created_at,
            updated_at: usuario.updated_at
        } })
    } catch (error) {
        response.status(500).json({ erro: "Erro ao atualizar perfil", mensagem: error.message })
    }
}

export const buscarUsuarioPorId = async (request, response) => {
    try {
        const { id } = request.params

        if (!id) {
            return response
                .status(400)
                .json({ erro: "Id inválido", mensagem: "O ID não pode ser vazio" })
        }

        const usuario = await usuarioModel.findByPk(id)
        if (!usuario) {
            return response
                .status(404)
                .json({ erro: "Usuário não encontrado", mensagem: "Nenhum usuário encontrado com este ID" })
        }

        response.status(200).json({ mensagem: "Usuário encontrado!", usuario: {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            tipoUsuario: usuario.tipoUsuario
        } })
    } catch (error) {
        response.status(500).json({ erro: "Erro ao buscar usuário", mensagem: error.message })
    }
}