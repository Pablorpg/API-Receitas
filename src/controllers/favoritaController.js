import favoritaModel from "../models/favoritaModel.js"
import receitasModel from "../models/receitasModel.js"
import usuarioModel from "../models/usuarioModel.js"
import { Sequelize } from "sequelize"

export const adicionarFavorita = async (request, response) => {
    try {
        const { receitaId, categoria, observacoes, prioridade } = request.body
        const usuarioId = request.userId

        if (!receitaId) {
            return response
                .status(400)
                .json({ erro: "Campo receitaId inválido", mensagem: "O campo receitaId é obrigatório" })
        }

        const receita = await receitasModel.findByPk(receitaId)
        if (!receita) {
            return response
                .status(404)
                .json({ erro: "Receita não encontrada", mensagem: "Nenhuma receita encontrada com este ID" })
        }

        const favoritaExistente = await favoritaModel.findOne({
            where: { usuarioId, receitaId }
        })
        if (favoritaExistente) {
            return response
                .status(409)
                .json({ erro: "Receita já favoritada", mensagem: "Esta receita já está nos favoritos do usuário" })
        }

        if (categoria && (typeof categoria !== "string" || categoria.length > 50)) {
            return response
                .status(400)
                .json({ erro: "Campo categoria inválido", mensagem: "A categoria deve ser uma string com até 50 caracteres" })
        }

        if (observacoes && (typeof observacoes !== "string" || observacoes.length > 500)) {
            return response
                .status(400)
                .json({ erro: "Campo observacoes inválido", mensagem: "As observações devem ser uma string com até 500 caracteres" })
        }

        if (prioridade && !["baixa", "media", "alta"].includes(prioridade)) {
            return response
                .status(400)
                .json({ erro: "Campo prioridade inválido", mensagem: "A prioridade deve ser 'baixa', 'media' ou 'alta'" })
        }

        const favorita = await favoritaModel.create({
            usuarioId,
            receitaId,
            categoria,
            observacoes,
            prioridade: prioridade || "baixa",
            tentativasPreparo: 0
        })

        response.status(201).json({
            success: true,
            data: {
                id: favorita.id,
                usuarioId: favorita.usuarioId,
                receitaId: favorita.receitaId,
                dataAdicionada: favorita.dataAdicionada,
                categoria: favorita.categoria,
                observacoes: favorita.observacoes,
                prioridade: favorita.prioridade,
                tentativasPreparo: favorita.tentativasPreparo,
                created_at: favorita.created_at
            }
        })
    } catch (error) {
        response.status(500).json({ erro: "Erro ao adicionar favorita", mensagem: error.message })
    }
}

export const listarFavoritas = async (request, response) => {
    try {
        const usuarioId = request.userId

        const favoritas = await favoritaModel.findAll({
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
            data: favoritas.map(favorita => ({
                id: favorita.id,
                usuarioId: favorita.usuarioId,
                receita: {
                    id: favorita.receita.id,
                    titulo: favorita.receita.titulo,
                    ingredientes: favorita.receita.ingredientes,
                    instrucoes: favorita.receita.instrucoes,
                    chefId: favorita.receita.chefId,
                    usuarioId: favorita.receita.usuarioId
                },
                dataAdicionada: favorita.dataAdicionada,
                categoria: favorita.categoria,
                observacoes: favorita.observacoes,
                prioridade: favorita.prioridade,
                tentativasPreparo: favorita.tentativasPreparo,
                created_at: favorita.created_at,
                updated_at: favorita.updated_at
            }))
        })
    } catch (error) {
        response.status(500).json({ erro: "Erro ao listar favoritas", mensagem: error.message })
    }
}

export const removerFavorita = async (request, response) => {
    try {
        const { id } = request.params
        const usuarioId = request.userId

        if (!id) {
            return response
                .status(400)
                .json({ erro: "ID inválido", mensagem: "O ID da favorita é obrigatório" })
        }

        const favorita = await favoritaModel.findByPk(id)
        if (!favorita) {
            return response
                .status(404)
                .json({ erro: "Favorita não encontrada", mensagem: "Nenhuma favorita encontrada com este ID" })
        }

        if (favorita.usuarioId !== usuarioId) {
            return response
                .status(403)
                .json({ erro: "Acesso negado", mensagem: "Você não tem permissão para remover esta favorita" })
        }

        await favorita.destroy()

        response.status(200).json({
            success: true,
            data: { mensagem: "Favorita removida com sucesso" }
        })
    } catch (error) {
        response.status(500).json({ erro: "Erro ao remover favorita", mensagem: error.message })
    }
}

export const buscarFavoritaPorId = async (request, response) => {
    try {
        const { id } = request.params
        const usuarioId = request.userId

        if (!id) {
            return response
                .status(400)
                .json({ erro: "ID inválido", mensagem: "O ID da favorita é obrigatório" })
        }

        const favorita = await favoritaModel.findByPk(id, {
            include: [
                {
                    model: receitasModel,
                    attributes: ["id", "titulo", "ingredientes", "instrucoes", "chefId", "usuarioId"]
                }
            ]
        })

        if (!favorita) {
            return response
                .status(404)
                .json({ erro: "Favorita não encontrada", mensagem: "Nenhuma favorita encontrada com este ID" })
        }

        if (favorita.usuarioId !== usuarioId) {
            return response
                .status(403)
                .json({ erro: "Acesso negado", mensagem: "Você não tem permissão para acessar esta favorita" })
        }

        response.status(200).json({
            success: true,
            data: {
                id: favorita.id,
                usuarioId: favorita.usuarioId,
                receita: {
                    id: favorita.receita.id,
                    titulo: favorita.receita.titulo,
                    ingredientes: favorita.receita.ingredientes,
                    instrucoes: favorita.receita.instrucoes,
                    chefId: favorita.receita.chefId,
                    usuarioId: favorita.receita.usuarioId
                },
                dataAdicionada: favorita.dataAdicionada,
                categoria: favorita.categoria,
                observacoes: favorita.observacoes,
                prioridade: favorita.prioridade,
                tentativasPreparo: favorita.tentativasPreparo,
                created_at: favorita.created_at,
                updated_at: favorita.updated_at
            }
        })
    } catch (error) {
        response.status(500).json({ erro: "Erro ao buscar favorita", mensagem: error.message })
    }
}

export const listarTodasFavoritas = async (request, response) => {
    try {
        const favoritas = await favoritaModel.findAll({
            include: [
                {
                    model: receitasModel,
                    attributes: ["id", "titulo", "ingredientes", "instrucoes", "chefId", "usuarioId"]
                },
                {
                    model: usuarioModel,
                    attributes: ["id", "nome", "email", "tipoUsuario"]
                }
            ]
        })

        response.status(200).json({
            success: true,
            data: favoritas.map(favorita => ({
                id: favorita.id,
                usuario: {
                    id: favorita.usuario.id,
                    nome: favorita.usuario.nome,
                    email: favorita.usuario.email,
                    tipoUsuario: favorita.usuario.tipoUsuario
                },
                receita: {
                    id: favorita.receita.id,
                    titulo: favorita.receita.titulo,
                    ingredientes: favorita.receita.ingredientes,
                    instrucoes: favorita.receita.instrucoes,
                    chefId: favorita.receita.chefId,
                    usuarioId: favorita.receita.usuarioId
                },
                dataAdicionada: favorita.dataAdicionada,
                categoria: favorita.categoria,
                observacoes: favorita.observacoes,
                prioridade: favorita.prioridade,
                tentativasPreparo: favorita.tentativasPreparo,
                created_at: favorita.created_at,
                updated_at: favorita.updated_at
            }))
        })
    } catch (error) {
        response.status(500).json({ erro: "Erro ao listar todas as favoritas", mensagem: error.message })
    }
}

export const estatisticasFavoritas = async (request, response) => {
    try {
        const estatisticas = await favoritaModel.findAll({
            attributes: [
                "receitaId",
                [Sequelize.fn("COUNT", Sequelize.col("receitaId")), "totalFavoritas"]
            ],
            include: [
                {
                    model: receitasModel,
                    attributes: ["id", "titulo", "ingredientes", "instrucoes", "chefId", "usuarioId"]
                }
            ],
            group: ["receitaId", "receita.id"],
            order: [[Sequelize.literal("totalFavoritas"), "DESC"]]
        })

        response.status(200).json({
            success: true,
            data: estatisticas.map(estatistica => ({
                receita: {
                    id: estatistica.receita.id,
                    titulo: estatistica.receita.titulo,
                    ingredientes: estatistica.receita.ingredientes,
                    instrucoes: estatistica.receita.instrucoes,
                    chefId: estatistica.receita.chefId,
                    usuarioId: estatistica.receita.usuarioId
                },
                totalFavoritas: parseInt(estatistica.getDataValue("totalFavoritas"))
            }))
        })
    } catch (error) {
        response.status(500).json({ erro: "Erro ao obter estatísticas", mensagem: error.message })
    }
}