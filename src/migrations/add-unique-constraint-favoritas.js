import { DataTypes } from "sequelize"

export async function up(queryInterface) {
    await queryInterface.addConstraint("favoritas", {
        fields: ["usuarioId", "receitaId"],
        type: "unique",
        name: "unique_usuario_receita"
    })
}

export async function down(queryInterface) {
    await queryInterface.removeConstraint("favoritas", "unique_usuario_receita")
}