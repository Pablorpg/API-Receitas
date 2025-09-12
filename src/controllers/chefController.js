import chefModel from "../models/chefModel.js"

export const criarChef = async (request, response) => {
    try {
        const { nome, biografia, especialidade, experiencia, nacionalidade } = request.body

        if (!nome) {
            response.status(400).json({ erro: "Campo nome inválido", mensagem: "O campo nome não pode ser vazio" })
            return
        }
        if (!biografia) {
            response.status(400).json({ erro: "Campo biografia inválido", mensagem: "O campo biografia não pode ser vazio" })
            return
        }
        if (!especialidade) {
            response.status(400).json({ erro: "Campo especialidade inválido", mensagem: "O campo especialidade não pode ser vazio" })
            return
        }
        if (!experiencia) {
            response.status(400).json({ erro: "Campo experiencia inválido", mensagem: "O campo experiencia não pode ser vazio" })
            return
        }
        if (!nacionalidade) {
            response.status(400).json({ erro: "Campo nacionalidade inválido", mensagem: "O campo nacionalidade não pode ser vazio" })
            return
        }

        const novoChef = await chefModel.create({ nome, biografia, especialidade, experiencia, nacionalidade })
        response.status(201).json({ mensagem: "Chef criado!", novoChef })
    } catch (error) {
        response.status(500).json({ message: "Erro ao criar chef", error: error.message })
    }
}

export const listarChefs = async (request, response) => {
    try {
        const chefs = await chefModel.findAll()
        response.json(chefs)
    } catch (error) {
        response.status(500).json({ message: "Erro ao listar chefs", error: error.message })
    }
}

export const buscarChefPorId = async (request, response) => {
    try {
        const { id } = request.params
        if (!id) {
            return response.status(404).json({ message: "Id não encontrado ou incorreto" })
        }

        const chef = await chefModel.findByPk(id)
        if (!chef) {
            return response.status(404).json({ message: "Chef não encontrado" })
        }

        response.status(200).json(chef)
    } catch (error) {
        response.status(500).json({ message: "Erro ao buscar chef", error: error.message })
    }
}

export const atualizarChef = async (request, response) => {
    try {
        const { id } = request.params
        if (!id) {
            return response.status(404).json({ message: "Id não encontrado ou incorreto" })
        }

        const { nome, biografia, especialidade, experiencia, nacionalidade } = request.body
        const Atualizar = await chefModel.findByPk(id)

        if (!Atualizar) {
            return response.status(404).json({ message: "Chef não encontrado!" })
        }

        Atualizar.nome = nome
        Atualizar.biografia = biografia
        Atualizar.especialidade = especialidade
        Atualizar.experiencia = experiencia
        Atualizar.nacionalidade = nacionalidade

        await Atualizar.save()
        response.status(200).json({ message: `Chef: ${nome}, suas informações foram atualizadas.`, Atualizar })
    } catch (error) {
        response.status(500).json({ message: "Erro ao atualizar chef", error: error.message })
    }
}

export const deletarChef = async (request, response) => {
    try {
        const { id } = request.params
        if (!id) {
            return response.status(404).json({ message: "Id não encontrado ou incorreto" })
        }

        const Deletar = await chefModel.findByPk(id)
        if (!Deletar) {
            return response.status(404).json({ message: "Chef não encontrado!" })
        }

        await Deletar.destroy()
        response.status(204).send()
    } catch (error) {
        response.status(500).json({ message: "Erro ao deletar chef", error: error.message })
    }
}
