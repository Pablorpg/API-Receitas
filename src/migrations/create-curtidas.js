import { DataTypes } from "sequelize"

export async function up(queryInterface) {
    await queryInterface.createTable("curtidas", {
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
        created_at: {
            type: DataTypes.DATE,
            allowNull: false
        }
    })

    await queryInterface.addConstraint("curtidas", {
        fields: ["usuarioId", "receitaId"],
        type: "unique",
        name: "unique_usuario_receita_curtida"
    })
}

export async function down(queryInterface) {
    await queryInterface.removeConstraint("curtidas", "unique_usuario_receita_curtida")
    await queryInterface.dropTable("curtidas")
}