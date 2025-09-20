import curtidaModel from "../models/curtidaModel.js"
import receitasModel from "../models/receitasModel.js"
import { Sequelize } from "sequelize"

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

export const listarCurtidasUsuario = async (request, response) => {
    try {
        const usuarioId = request.userId

        const curtidas = await curtidaModel.findAll({
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
            data: curtidas.map(curtida => ({
                id: curtida.id,
                usuarioId: curtida.usuarioId,
                receita: {
                    id: curtida.receita.id,
                    titulo: curtida.receita.titulo,
                    ingredientes: curtida.receita.ingredientes,
                    instrucoes: curtida.receita.instrucoes,
                    chefId: curtida.receita.chefId,
                    usuarioId: curtida.receita.usuarioId
                },
                created_at: curtida.created_at
            }))
        })
    } catch (error) {
        response.status(500).json({ erro: "Erro ao listar curtidas", mensagem: error.message })
    }
}

export const listarReceitasPopulares = async (request, response) => {
    try {
        const populares = await curtidaModel.findAll({
            attributes: [
                "receitaId",
                [Sequelize.fn("COUNT", Sequelize.col("receitaId")), "totalCurtidas"]
            ],
            include: [
                {
                    model: receitasModel,
                    attributes: ["id", "titulo", "ingredientes", "instrucoes", "chefId", "usuarioId"]
                }
            ],
            group: ["receitaId", "receita.id"],
            order: [[Sequelize.literal("totalCurtidas"), "DESC"]]
        })

        response.status(200).json({
            success: true,
            data: populares.map(popular => ({
                receita: {
                    id: popular.receita.id,
                    titulo: popular.receita.titulo,
                    ingredientes: popular.receita.ingredientes,
                    instrucoes: popular.receita.instrucoes,
                    chefId: popular.receita.chefId,
                    usuarioId: popular.receita.usuarioId
                },
                totalCurtidas: parseInt(popular.getDataValue("totalCurtidas"))
            }))
        })
    } catch (error) {
        response.status(500).json({ erro: "Erro ao listar receitas populares", mensagem: error.message })
    }
}