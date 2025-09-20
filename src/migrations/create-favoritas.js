import { DataTypes } from "sequelize"

export async function up(queryInterface) {
    await queryInterface.createTable("favoritas", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        usuarioId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "usuarios",
                key: "id"
            }
        },
        receitaId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "receitas",
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
            defaultValue: 0
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
    await queryInterface.dropTable("favoritas")
}