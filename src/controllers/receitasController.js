import receitasModel from "../models/receitasModel.js"
import chefModel from "../models/chefModel.js"
import { Op } from "sequelize"

export const criarReceita = async (request, response) => {
    try {
        const { titulo, descricao, ingredientes, modoPreparo, tempoPreparo, porcoes, dificuldade, chefIds } = request.body

        if (!titulo) {
            return response
                .status(400)
                .json({ erro: "Campo título inválido", mensagem: "O campo título não pode ser vazio" })
        }
        if (typeof titulo !== "string" || titulo.length < 3 || titulo.length > 100) {
            return response
                .status(400)
                .json({ erro: "Campo título inválido", mensagem: "O título deve ser uma string com 3 a 100 caracteres" })
        }

        if (!descricao) {
            return response
                .status(400)
                .json({ erro: "Campo descrição inválido", mensagem: "O campo descrição não pode ser vazio" })
        }
        if (typeof descricao !== "string" || descricao.length < 10) {
            return response
                .status(400)
                .json({ erro: "Campo descrição inválido", mensagem: "A descrição deve ser uma string com no mínimo 10 caracteres" })
        }

        if (!ingredientes) {
            return response
                .status(400)
                .json({ erro: "Campo ingredientes inválido", mensagem: "O campo ingredientes não pode ser vazio" })
        }
        if (typeof ingredientes !== "string" || ingredientes.length < 10) {
            return response
                .status(400)
                .json({ erro: "Campo ingredientes inválido", mensagem: "Os ingredientes devem ser uma string com no mínimo 10 caracteres" })
        }

        if (!modoPreparo) {
            return response
                .status(400)
                .json({ erro: "Campo modoPreparo inválido", mensagem: "O campo modoPreparo não pode ser vazio" })
        }
        if (typeof modoPreparo !== "string" || modoPreparo.length < 10) {
            return response
                .status(400)
                .json({ erro: "Campo modoPreparo inválido", mensagem: "O modo de preparo deve ser uma string com no mínimo 10 caracteres" })
        }

        if (!tempoPreparo) {
            return response
                .status(400)
                .json({ erro: "Campo tempoPreparo inválido", mensagem: "O campo tempoPreparo não pode ser vazio" })
        }
        if (!Number.isInteger(tempoPreparo) || tempoPreparo <= 0) {
            return response
                .status(400)
                .json({ erro: "Campo tempoPreparo inválido", mensagem: "O tempo de preparo deve ser um número inteiro maior que 0" })
        }

        if (!porcoes) {
            return response
                .status(400)
                .json({ erro: "Campo porções inválido", mensagem: "O campo porções não pode ser vazio" })
        }
        if (!Number.isInteger(porcoes) || porcoes <= 0) {
            return response
                .status(400)
                .json({ erro: "Campo porções inválido", mensagem: "O número de porções deve ser um número inteiro maior que 0" })
        }

        if (!dificuldade) {
            return response
                .status(400)
                .json({ erro: "Campo dificuldade inválido", mensagem: "O campo dificuldade não pode ser vazio" })
        }
        const dificuldadesValidas = ["Fácil", "Média", "Difícil"]
        if (!dificuldadesValidas.includes(dificuldade)) {
            return response
                .status(400)
                .json({ erro: "Campo dificuldade inválido", mensagem: "A dificuldade deve ser 'Fácil', 'Média' ou 'Difícil'" })
        }

        if (chefIds && (!Array.isArray(chefIds) || chefIds.length === 0)) {
            return response
                .status(400)
                .json({ erro: "Campo chefIds inválido", mensagem: "chefIds deve ser um array não vazio de IDs válidos" })
        }

        const novaReceita = await receitasModel.create({
            titulo,
            descricao,
            ingredientes,
            modoPreparo,
            tempoPreparo,
            porcoes,
            dificuldade
        })

        if (chefIds && Array.isArray(chefIds) && chefIds.length > 0) {
            const chefs = await chefModel.findAll({
                where: { id: chefIds }
            })
            if (chefs.length !== chefIds.length) {
                await novaReceita.destroy()
                return response
                    .status(400)
                    .json({ erro: "Um ou mais chefs não encontrados", mensagem: "Verifique os IDs dos chefs fornecidos" })
            }
            await novaReceita.addChefs(chefs)
        }

        const receitaComChefs = await receitasModel.findByPk(novaReceita.id, {
            include: [{ model: chefModel, as: "chefs", attributes: ["id"] }]
        })

        response.status(201).json({ mensagem: "Receita criada!", receita: receitaComChefs })
    } catch (error) {
        response.status(500).json({ message: "Erro ao criar receita", error: error.message })
    }
}

export const listarReceitas = async (request, response) => {
    try {
        const {
            chef,
            titulo,
            dificuldade,
            tempoPreparoMin,
            tempoPreparoMax,
            porcoesMin,
            porcoesMax,
            q,
            page = 1,
            limit = 10
        } = request.query

        const offset = (page - 1) * limit

        const where = {}

        if (titulo) {
            where.titulo = { [Op.iLike]: `%${titulo}%` }
        }

        if (dificuldade) {
            where.dificuldade = dificuldade
        }

        if (tempoPreparoMin || tempoPreparoMax) {
            where.tempoPreparo = {}
            if (tempoPreparoMin) {
                where.tempoPreparo[Op.gte] = parseInt(tempoPreparoMin)
            }
            if (tempoPreparoMax) {
                where.tempoPreparo[Op.lte] = parseInt(tempoPreparoMax)
            }
        }

        if (porcoesMin || porcoesMax) {
            where.porcoes = {}
            if (porcoesMin) {
                where.porcoes[Op.gte] = parseInt(porcoesMin)
            }
            if (porcoesMax) {
                where.porcoes[Op.lte] = parseInt(porcoesMax)
            }
        }

        if (q) {
            where[Op.or] = [
                { titulo: { [Op.iLike]: `%${q}%` } },
                { descricao: { [Op.iLike]: `%${q}%` } }
            ]
        }

        const include = [
            {
                model: chefModel,
                as: "chefs",
                attributes: ["id"],
                through: { attributes: [] }
            }
        ]

        if (chef) {
            include[0].where = { id: chef }
        }

        const { count, rows } = await receitasModel.findAndCountAll({
            where,
            include,
            limit: parseInt(limit),
            offset: parseInt(offset)
        })

        response.json({
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            receitas: rows
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
            include: [{ model: chefModel, as: "chefs", attributes: ["id"] }]
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

        const { titulo, descricao, ingredientes, modoPreparo, tempoPreparo, porcoes, dificuldade, chefIds } = request.body

        const receita = await receitasModel.findByPk(id)
        if (!receita) {
            return response.status(404).json({ message: "Receita não encontrada" })
        }

        if (titulo && (typeof titulo !== "string" || titulo.length < 3 || titulo.length > 100)) {
            return response
                .status(400)
                .json({ erro: "Campo título inválido", mensagem: "O título deve ser uma string com 3 a 100 caracteres" })
        }

        if (descricao && (typeof descricao !== "string" || descricao.length < 10)) {
            return response
                .status(400)
                .json({ erro: "Campo descrição inválido", mensagem: "A descrição deve ser uma string com no mínimo 10 caracteres" })
        }

        if (ingredientes && (typeof ingredientes !== "string" || ingredientes.length < 10)) {
            return response
                .status(400)
                .json({ erro: "Campo ingredientes inválido", mensagem: "Os ingredientes devem ser uma string com no mínimo 10 caracteres" })
        }

        if (modoPreparo && (typeof modoPreparo !== "string" || modoPreparo.length < 10)) {
            return response
                .status(400)
                .json({ erro: "Campo modoPreparo inválido", mensagem: "O modo de preparo deve ser uma string com no mínimo 10 caracteres" })
        }

        if (tempoPreparo && (!Number.isInteger(tempoPreparo) || tempoPreparo <= 0)) {
            return response
                .status(400)
                .json({ erro: "Campo tempoPreparo inválido", mensagem: "O tempo de preparo deve ser um número inteiro maior que 0" })
        }

        if (porcoes && (!Number.isInteger(porcoes) || porcoes <= 0)) {
            return response
                .status(400)
                .json({ erro: "Campo porções inválido", mensagem: "O número de porções deve ser um número inteiro maior que 0" })
        }

        if (dificuldade && !["Fácil", "Média", "Difícil"].includes(dificuldade)) {
            return response
                .status(400)
                .json({ erro: "Campo dificuldade inválido", mensagem: "A dificuldade deve ser 'Fácil', 'Média' ou 'Difícil'" })
        }

        if (chefIds && (!Array.isArray(chefIds) || chefIds.length === 0)) {
            return response
                .status(400)
                .json({ erro: "Campo chefIds inválido", mensagem: "chefIds deve ser um array não vazio de IDs válidos" })
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
                where: { id: chefIds }
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
            include: [{ model: chefModel, as: "chefs", attributes: ["id"] }]
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

export const uploadImagem = async (request, response) => {
    try {
        const { id } = request.params
        if (!id) {
            return response
                .status(400)
                .json({ erro: "Id inválido", mensagem: "Id não encontrado ou incorreto" })
        }

        const receita = await receitasModel.findByPk(id, {
            include: [{ model: chefModel, as: "chefs", attributes: ["id"] }]
        })
        if (!receita) {
            return response
                .status(404)
                .json({ erro: "Receita não encontrada", mensagem: "Receita não encontrada" })
        }

        if (!request.file) {
            return response
                .status(400)
                .json({ erro: "Imagem não fornecida", mensagem: "Nenhuma imagem foi enviada" })
        }

        const imagemPrato = request.file.filename
        const imagemUrl = `/public/receitas/${imagemPrato}`

        await receita.update({ imagemPrato, imagemUrl })

        const receitaAtualizada = await receitasModel.findByPk(id, {
            include: [{ model: chefModel, as: "chefs", attributes: ["id"] }]
        })

        response
            .status(200)
            .json({ mensagem: `Imagem da receita ${receita.titulo} atualizada com sucesso`, receita: receitaAtualizada })
    } catch (error) {
        response.status(400).json({ erro: "Erro ao fazer upload da imagem", mensagem: error.message })
    }
}