import { DataTypes } from "sequelize"
import { conn } from "../config/sequelize.js"
import usuarioModel from "./usuarioModel.js"
import receitasModel from "./receitasModel.js"


const favoritaModel = conn.define(
    "favoritas",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        usuarioId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: usuarioModel,
                key: "id"
            }
        },
        receitaId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: receitasModel,
                key: "id"
            }
        },
        dataAdicionada: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        categoria: {
            type: DataTypes.STRING,
            allowNull: true
        },
        observacoes: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        prioridade: {
            type: DataTypes.ENUM("baixa", "media", "alta"),
            allowNull: false,
            defaultValue: "baixa"
        },
        tentativasPreparo: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: {
                    args: [0],
                    msg: "Tentativas de preparo deve ser maior ou igual a 0"
                }
            }
        }
    },
    {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
)

favoritaModel.belongsTo(usuarioModel, { foreignKey: "usuarioId" })
favoritaModel.belongsTo(receitasModel, { foreignKey: "receitaId" })
usuarioModel.hasMany(favoritaModel, { foreignKey: "usuarioId" })
receitasModel.hasMany(favoritaModel, { foreignKey: "receitaId" })

export default favoritaModel