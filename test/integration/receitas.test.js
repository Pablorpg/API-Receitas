import request from "supertest"
import app from "../../src/app.js"
import { conn } from "../../src/config/sequelize.js"
import chefModel from "../../src/models/chefs.js"
import receitaModel from "../../src/models/receitas.js"

describe("Integração Receitas-Chefs", () => {
  let chef
  let receita

  beforeAll(async () => {
    await conn.sync({ force: true })

    chef = await chefModel.create({
      nome: "Chef Pablo",
      biografia: "Especialista em massas"
    })

    receita = await receitaModel.create({
      titulo: "Macarrão Carbonara",
      descricao: "Receita clássica italiana",
      ingredientes: "Macarrão, ovos, queijo, pancetta",
      modoPreparo: "Cozinhar e misturar tudo",
      tempoPreparo: 30,
      porcoes: 4,
      dificuldade: "Médio"
    })

    await receita.addChef(chef)
  })

  it("Deve criar uma receita vinculada a um chef", async () => {
    const response = await request(app)
      .post("/api/receitas")
      .send({
        titulo: "Bolo de Cenoura",
        descricao: "Com cobertura de chocolate",
        ingredientes: "Cenoura, ovos, farinha, óleo, açúcar",
        modoPreparo: "Misturar tudo e assar",
        tempoPreparo: 50,
        porcoes: 8,
        dificuldade: "Fácil",
        chefs: [chef.id]
      })

    expect(response.status).toBe(201)
    expect(response.body.chefs).toContain(chef.id)
  })

  it("Deve listar receitas com os chefs vinculados", async () => {
    const response = await request(app).get("/api/receitas")

    expect(response.status).toBe(200)
    expect(response.body[0].chefs).toBeDefined()
    expect(response.body[0].chefs.length).toBeGreaterThan(0)
  })

  it("Deve filtrar receitas por chef", async () => {
    const response = await request(app).get(`/api/receitas?chef=${chef.id}`)

    expect(response.status).toBe(200)
    expect(response.body.every(r => r.chefs.includes(chef.id))).toBe(true)
  })
})
