import { DataTypes } from "sequelize"
import { conn } from "../config/sequelize.js"
import usuarioModel from "./usuarioModel.js"
import receitasModel from "./receitasModel.js"

const comentarioModel = conn.define(
    "comentarios",
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
        texto: {
            type: DataTypes.STRING(500),
            allowNull: false
        },
        avaliacao: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 5
            }
        },
        aprovado: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    },
    {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
)

comentarioModel.belongsTo(usuarioModel, { foreignKey: "usuarioId" })
comentarioModel.belongsTo(receitasModel, { foreignKey: "receitaId" })
usuarioModel.hasMany(comentarioModel, { foreignKey: "usuarioId" })
receitasModel.hasMany(comentarioModel, { foreignKey: "receitaId" })

export default comentarioModel