import curtidaModel from "../models/curtidaModel.js"
import receitasModel from "../models/receitasModel.js"

export const curtirReceita = async (request, response) => {
    try {
        const { id } = request.params
        const usuarioId = request.userId

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

        const curtidaExistente = await curtidaModel.findOne({
            where: { usuarioId, receitaId: id }
        })
        if (curtidaExistente) {
            return response
                .status(409)
                .json({ erro: "Receita já curtida", mensagem: "Você já curtiu esta receita" })
        }

        const curtida = await curtidaModel.create({
            usuarioId,
            receitaId: id
        })

        response.status(201).json({
            success: true,
            data: {
                id: curtida.id,
                usuarioId: curtida.usuarioId,
                receitaId: curtida.receitaId,
                created_at: curtida.created_at
            }
        })
    } catch (error) {
        response.status(500).json({ erro: "Erro ao curtir receita", mensagem: error.message })
    }
}

export const descurtirReceita = async (request, response) => {
    try {
        const { id } = request.params
        const usuarioId = request.userId

        if (!id) {
            return response
                .status(400)
                .json({ erro: "ID inválido", mensagem: "O ID da receita é obrigatório" })
        }

        const curtida = await curtidaModel.findOne({
            where: { usuarioId, receitaId: id }
        })
        if (!curtida) {
            return response
                .status(404)
                .json({ erro: "Curtida não encontrada", mensagem: "Você não curtiu esta receita" })
        }

        await curtida.destroy()

        response.status(200).json({
            success: true,
            data: { mensagem: "Curtida removida com sucesso" }
        })
    } catch (error) {
        response.status(500).json({ erro: "Erro ao descurtir receita", mensagem: error.message })
    }
}