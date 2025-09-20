import favoritaModel from "../models/favoritaModel.js"
import receitasModel from "../models/receitasModel.js"

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
                    attributes: ["id", "titulo", "ingredientes", "modoPreparo", "tempoPreparo", "porcoes", "dificuldade"]
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
                    modoPreparo: favorita.receita.modoPreparo,
                    tempoPreparo: favorita.receita.tempoPreparo,
                    porcoes: favorita.receita.porcoes,
                    dificuldade: favorita.receita.dificuldade
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