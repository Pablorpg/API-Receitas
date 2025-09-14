import receitasModel from "../models/receitasModel.js"
import chefModel from "../models/chefModel.js"

export const criarReceita = async (request, response) => {
    try {
        const { titulo, descricao, ingredientes, modoPreparo, tempoPreparo, porcoes, dificuldade, chefIds, } = request.body

        if (!titulo) {
            return response
                .status(400)
                .json({ erro: "Campo título inválido", mensagem: "O campo título não pode ser vazio" })
        }
        if (!descricao) {
            return response
                .status(400)
                .json({ erro: "Campo descrição inválido", mensagem: "O campo descrição não pode ser vazio" })
        }
        if (!ingredientes) {
            return response
                .status(400)
                .json({ erro: "Campo ingredientes inválido", mensagem: "O campo ingredientes não pode ser vazio" })
        }
        if (!modoPreparo) {
            return response
                .status(400)
                .json({ erro: "Campo modoPreparo inválido", mensagem: "O campo modoPreparo não pode ser vazio" })
        }
        if (!tempoPreparo) {
            return response
                .status(400)
                .json({ erro: "Campo tempoPreparo inválido", mensagem: "O campo tempoPreparo não pode ser vazio" })
        }
        if (!porcoes) {
            return response
                .status(400)
                .json({ erro: "Campo porções inválido", mensagem: "O campo porções não pode ser vazio" })
        }
        if (!dificuldade) {
            return response
                .status(400)
                .json({ erro: "Campo dificuldade inválido", mensagem: "O campo dificuldade não pode ser vazio" })
        }

        const novaReceita = await receitasModel.create({ titulo, descricao, ingredientes, modoPreparo, tempoPreparo, porcoes, dificuldade, })

        if (chefIds && Array.isArray(chefIds) && chefIds.length > 0) {
            const chefs = await chefModel.findAll({
                where: { id: chefIds },
            })
            if (chefs.length !== chefIds.length) {
                return response
                    .status(400)
                    .json({ erro: "Um ou mais chefs não encontrados", mensagem: "Verifique os IDs dos chefs fornecidos" })
            }
            await novaReceita.addChefs(chefs)
        }

        const receitaComChefs = await receitasModel.findByPk(novaReceita.id, {
            include: [{ model: chefModel, as: "chefs", attributes: ["id"] }],
        })

        response.status(201).json({ mensagem: "Receita criada!", receita: receitaComChefs })
    } catch (error) {
        response.status(500).json({ message: "Erro ao criar receita", error: error.message })
    }
}

export const listarReceitas = async (request, response) => {
    try {
        const { chef, page = 1, limit = 10 } = request.query
        const offset = (page - 1) * limit

        const where = {}
        const include = [
            {
                model: chefModel,
                as: "chefs",
                attributes: ["id"],
                through: { attributes: [] },
            },
        ]

        if (chef) {
            include[0].where = { id: chef }
        }

        const { count, rows } = await receitasModel.findAndCountAll({
            where,
            include,
            limit: parseInt(limit),
            offset: parseInt(offset),
        })

        response.json({
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            receitas: rows,
        })
    } catch (error) {
        response.status(500).json({ message: "Erro ao listar receitas", error: error.message })
    }
}

export const buscarReceitaPorId = async (request, response) => {
    try {
        const { id } = request.params
        if (!id) {
            return response
                .status(400)
                .json({ message: "Id não encontrado ou incorreto" })
        }

        const receita = await receitasModel.findByPk(id, {
            include: [{ model: chefModel, as: "chefs", attributes: ["id"] }],
        })
        if (!receita) {
            return response.status(404).json({ message: "Receita não encontrada" })
        }

        response.status(200).json(receita)
    } catch (error) {
        response.status(500).json({ message: "Erro ao buscar receita", error: error.message })
    }
}

export const atualizarReceita = async (request, response) => {
    try {
        const { id } = request.params
        if (!id) {
            return response
                .status(400)
                .json({ message: "Id não encontrado ou incorreto" })
        }

        const { titulo, descricao, ingredientes, modoPreparo, tempoPreparo, porcoes, dificuldade, chefIds, } = request.body

        const receita = await receitasModel.findByPk(id)
        if (!receita) {
            return response.status(404).json({ message: "Receita não encontrada" })
        }

        receita.titulo = titulo || receita.titulo
        receita.descricao = descricao || receita.descricao
        receita.ingredientes = ingredientes || receita.ingredientes
        receita.modoPreparo = modoPreparo || receita.modoPreparo
        receita.tempoPreparo = tempoPreparo || receita.tempoPreparo
        receita.porcoes = porcoes || receita.porcoes
        receita.dificuldade = dificuldade || receita.dificuldade

        if (chefIds && Array.isArray(chefIds)) {
            const chefs = await chefModel.findAll({
                where: { id: chefIds },
            })
            if (chefs.length !== chefIds.length) {
                return response
                    .status(400)
                    .json({ erro: "Um ou mais chefs não encontrados", mensagem: "Verifique os IDs dos chefs fornecidos" })
            }
            await receita.setChefs(chefs)
        }

        await receita.save()

        const receitaAtualizada = await receitasModel.findByPk(id, {
            include: [{ model: chefModel, as: "chefs", attributes: ["id"] }],
        })

        response
            .status(200)
            .json({ message: `Receita: ${receita.titulo}, suas informações foram atualizadas.`, receita: receitaAtualizada })
    } catch (error) {
        response.status(500).json({ message: "Erro ao atualizar receita", error: error.message })
    }
}

export const deletarReceita = async (request, response) => {
    try {
        const { id } = request.params
        if (!id) {
            return response
                .status(400)
                .json({ message: "Id não encontrado ou incorreto" })
        }

        const receita = await receitasModel.findByPk(id)
        if (!receita) {
            return response.status(404).json({ message: "Receita não encontrada" })
        }

        await receita.destroy()
        response.status(204).send()
    } catch (error) {
        response.status(500).json({ message: "Erro ao deletar receita", error: error.message })
    }
}