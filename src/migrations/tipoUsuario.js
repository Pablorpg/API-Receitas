import { DataTypes } from "sequelize"

export async function up(queryInterface) {
    await queryInterface.renameColumn("usuarios", "funcao", "tipoUsuario")
}

export async function down(queryInterface) {
    await queryInterface.renameColumn("usuarios", "tipoUsuario", "funcao")
}