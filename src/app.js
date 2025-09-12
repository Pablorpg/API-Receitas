import express from "express"
import cors from "cors"
import { conn } from "./config/sequelize.js"

// TABELAS

// ROTAS

conn
    .sync()
    .then(() => {
        console.log("Banco de dados conectado!")
    })
    .catch((error) => console.log(error))

const app = express()

conn.sync()

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
}))
app.use(express.json())

// USAR/REGISTRAR AS ROTAS

export default app