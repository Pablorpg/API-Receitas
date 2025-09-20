import { DataTypes } from "sequelize"

export async function up(queryInterface) {
    await queryInterface.createTable("comentarios", {
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
    await queryInterface.dropTable("comentarios")
}