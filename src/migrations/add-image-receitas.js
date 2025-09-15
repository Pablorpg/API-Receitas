import { DataTypes } from "sequelize"

export async function up(queryInterface) {
    await queryInterface.addColumn("receitas", "imagemPrato", {
        type: DataTypes.STRING,
        allowNull: true
    })
    await queryInterface.addColumn("receitas", "imagemUrl", {
        type: DataTypes.STRING,
        allowNull: true
    })
}

export async function down(queryInterface) {
    await queryInterface.removeColumn("receitas", "imagemPrato")
    await queryInterface.removeColumn("receitas", "imagemUrl")
}