export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable("usuarios", {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        nome: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        senha: {
            type: Sequelize.STRING,
            allowNull: false
        },
        funcao: {
            type: Sequelize.ENUM("admin", "comum"),
            allowNull: false,
            defaultValue: "comum"
        },
        created_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn("NOW")
        },
        updated_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn("NOW")
        }
    })
}

export async function down(queryInterface) {
    await queryInterface.dropTable("usuarios")
}