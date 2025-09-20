import { DataTypes } from "sequelize"
import { conn } from "../config/sequelize.js"
import usuarioModel from "./usuarioModel.js"

const refreshTokenModel = conn.define(
    "refresh_tokens",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false
        },
        usuarioId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: usuarioModel,
                key: "id"
            }
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false
        }
    },
    {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
)

refreshTokenModel.belongsTo(usuarioModel, { foreignKey: "usuarioId" })
usuarioModel.hasMany(refreshTokenModel, { foreignKey: "usuarioId" })

export default refreshTokenModel