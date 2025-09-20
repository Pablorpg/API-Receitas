import express from "express";
import cors from "cors";
import path from "path";
import { conn } from "./config/sequelize.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import dotenv from "dotenv"

dotenv.config()

// TABELAS
import "./models/association.js";

// ROTAS
import chefRoute from "./routes/chefRoute.js";
import receitasRoutes from "./routes/receitasRoute.js";
import usuarioRoute from "./routes/usuarioRoute.js"

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  credentials: true,
}));
app.use(express.json());

// Configuração para servir arquivos estáticos
const __dirname = path.resolve();
app.use("/imagens", express.static(path.join(__dirname, "src/public/imagens")));

// USAR/REGISTRAR AS ROTAS
app.use("/api/chefs", chefRoute);
app.use("/api/receitas", receitasRoutes);
app.use("/api/usuarios", usuarioRoute)

// Middleware de erros
app.use(errorHandler);

// Sincronizar o banco de dados
conn
  .sync()
  .then(() => {
    console.log("Banco de dados conectado!");
  })
  .catch((error) => {
    console.log("Erro ao conectar ao banco de dados:", error);
  });

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

export default app;
