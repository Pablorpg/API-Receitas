import comentarioModel from "../models/comentarioModel.js"
import receitasModel from "../models/receitasModel.js"
import usuarioModel from "../models/usuarioModel.js"

export const criarComentario = async (request, response) => {
    try {
        const { id } = request.params
        const { texto, avaliacao } = request.body
        const usuarioId = request.userId

        if (!id) {
            return response
                .status(400)
                .json({ erro: "ID inválido", mensagem: "O ID da receita é obrigatório" })
        }

        if (!texto || typeof texto !== "string" || texto.length > 500) {
            return response
                .status(400)
                .json({ erro: "Texto inválido", mensagem: "O texto deve ser uma string com até 500 caracteres" })
        }

        if (!Number.isInteger(avaliacao) || avaliacao < 1 || avaliacao > 5) {
            return response
                .status(400)
                .json({ erro: "Avaliação inválida", mensagem: "A avaliação deve ser um número inteiro entre 1 e 5" })
        }

        const receita = await receitasModel.findByPk(id)
        if (!receita) {
            return response
                .status(404)
                .json({ erro: "Receita não encontrada", mensagem: "Nenhuma receita encontrada com este ID" })
        }

        const comentario = await comentarioModel.create({
            usuarioId,
            receitaId: id,
            texto,
            avaliacao,
            aprovado: false
        })

        response.status(201).json({
            success: true,
            data: {
                id: comentario.id,
                usuarioId: comentario.usuarioId,
                receitaId: comentario.receitaId,
                texto: comentario.texto,
                avaliacao: comentario.avaliacao,
                aprovado: comentario.aprovado,
                created_at: comentario.created_at,
                updated_at: comentario.updated_at
            }
        })
    } catch (error) {
        response.status(500).json({ erro: "Erro ao criar comentário", mensagem: error.message })
    }
}

export const listarComentariosReceita = async (request, response) => {
    try {
        const { id } = request.params

        if (!id) {
            return response
                .status(400)
                .json({ erro: "ID inválido", mensagem: "O ID da receita é obrigatório" })
        }

        const receita = await receitasModel.findByPk(id)
        if (!receita) {
            return response
                .status(404)
                .json({ erro: "Receita não encontrada", mensagem: "Nenhuma receita encontrada com este ID" })
        }

        const comentarios = await comentarioModel.findAll({
            where: { receitaId: id, aprovado: true },
            include: [
                {
                    model: usuarioModel,
                    attributes: ["id", "nome", "email", "tipoUsuario"]
                }
            ]
        })

        response.status(200).json({
            success: true,
            data: comentarios.map(comentario => ({
                id: comentario.id,
                usuario: {
                    id: comentario.usuario.id,
                    nome: comentario.usuario.nome,
                    email: comentario.usuario.email,
                    tipoUsuario: comentario.usuario.tipoUsuario
                },
                receitaId: comentario.receitaId,
                texto: comentario.texto,
                avaliacao: comentario.avaliacao,
                aprovado: comentario.aprovado,
                created_at: comentario.created_at,
                updated_at: comentario.updated_at
            }))
        })
    } catch (error) {
        response.status(500).json({ erro: "Erro ao listar comentários", mensagem: error.message })
    }
}

export const editarComentario = async (request, response) => {
    try {
        const { id } = request.params
        const { texto, avaliacao } = request.body
        const usuarioId = request.userId

        if (!id) {
            return response
                .status(400)
                .json({ erro: "ID inválido", mensagem: "O ID do comentário é obrigatório" })
        }

        const comentario = await comentarioModel.findByPk(id)
        if (!comentario) {
            return response
                .status(404)
                .json({ erro: "Comentário não encontrado", mensagem: "Nenhum comentário encontrado com este ID" })
        }

        if (comentario.usuarioId !== usuarioId) {
            return response
                .status(403)
                .json({ erro: "Acesso negado", mensagem: "Você não tem permissão para editar este comentário" })
        }

        if (texto && (typeof texto !== "string" || texto.length > 500)) {
            return response
                .status(400)
                .json({ erro: "Texto inválido", mensagem: "O texto deve ser uma string com até 500 caracteres" })
        }

        if (avaliacao && (!Number.isInteger(avaliacao) || avaliacao < 1 || avaliacao > 5)) {
            return response
                .status(400)
                .json({ erro: "Avaliação inválida", mensagem: "A avaliação deve ser um número inteiro entre 1 e 5" })
        }

        comentario.texto = texto || comentario.texto
        comentario.avaliacao = avaliacao || comentario.avaliacao
        comentario.aprovado = false // Resetar aprovação após edição
        await comentario.save()

        response.status(200).json({
            success: true,
            data: {
                id: comentario.id,
                usuarioId: comentario.usuarioId,
                receitaId: comentario.receitaId,
                texto: comentario.texto,
                avaliacao: comentario.avaliacao,
                aprovado: comentario.aprovado,
                created_at: comentario.created_at,
                updated_at: comentario.updated_at
            }
        })
    } catch (error) {
        response.status(500).json({ erro: "Erro ao editar comentário", mensagem: error.message })
    }
}

export const deletarComentario = async (request, response) => {
    try {
        const { id } = request.params
        const usuarioId = request.userId

        if (!id) {
            return response
                .status(400)
                .json({ erro: "ID inválido", mensagem: "O ID do comentário é obrigatório" })
        }

        const comentario = await comentarioModel.findByPk(id)
        if (!comentario) {
            return response
                .status(404)
                .json({ erro: "Comentário não encontrado", mensagem: "Nenhum comentário encontrado com este ID" })
        }

        if (comentario.usuarioId !== usuarioId) {
            return response
                .status(403)
                .json({ erro: "Acesso negado", mensagem: "Você não tem permissão para deletar este comentário" })
        }

        await comentario.destroy()

        response.status(200).json({
            success: true,
            data: { mensagem: "Comentário deletado com sucesso" }
        })
    } catch (error) {
        response.status(500).json({ erro: "Erro ao deletar comentário", mensagem: error.message })
    }
}

export const listarComentariosUsuario = async (request, response) => {
    try {
        const usuarioId = request.userId

        const comentarios = await comentarioModel.findAll({
            where: { usuarioId },
            include: [
                {
                    model: receitasModel,
                    attributes: ["id", "titulo", "ingredientes", "instrucoes", "chefId", "usuarioId"]
                }
            ]
        })

        response.status(200).json({
            success: true,
            data: comentarios.map(comentario => ({
                id: comentario.id,
                usuarioId: comentario.usuarioId,
                receita: {
                    id: comentario.receita.id,
                    titulo: comentario.receita.titulo,
                    ingredientes: comentario.receita.ingredientes,
                    instrucoes: comentario.receita.instrucoes,
                    chefId: comentario.receita.chefId,
                    usuarioId: comentario.receita.usuarioId
                },
                texto: comentario.texto,
                avaliacao: comentario.avaliacao,
                aprovado: comentario.aprovado,
                created_at: comentario.created_at,
                updated_at: comentario.updated_at
            }))
        })
    } catch (error) {
        response.status(500).json({ erro: "Erro ao listar comentários", mensagem: error.message })
    }
}