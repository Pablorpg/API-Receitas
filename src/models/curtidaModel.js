import { DataTypes } from "sequelize"
import { conn } from "../config/sequelize.js"
import usuarioModel from "./usuarioModel.js"
import receitasModel from "./receitasModel.js"

const curtidaModel = conn.define(
    "curtidas",
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
        }
    },
    {
        createdAt: "created_at",
        updatedAt: false
    }
)

curtidaModel.belongsTo(usuarioModel, { foreignKey: "usuarioId" })
curtidaModel.belongsTo(receitasModel, { foreignKey: "receitaId" })
usuarioModel.hasMany(curtidaModel, { foreignKey: "usuarioId" })
receitasModel.hasMany(curtidaModel, { foreignKey: "receitaId" })

export default curtidaModel