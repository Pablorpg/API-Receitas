import { DataTypes } from "sequelize"

export async function up(queryInterface) {
    await queryInterface.createTable("refresh_tokens", {
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
                model: "usuarios",
                key: "id"
            }
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false
        }
    })
}

export async function down(queryInterface) {
    await queryInterface.dropTable("refresh_tokens")
}