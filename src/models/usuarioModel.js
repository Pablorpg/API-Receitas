import { DataTypes } from "sequelize"
import { conn } from "../config/sequelize.js"
import bcrypt from "bcrypt"

const usuarioModel = conn.define(
    "usuarios",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        nome: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                msg: "Email já está em uso"
            },
            validate: {
                isEmail: {
                    msg: "Email deve ser válido"
                }
            }
        },
        senha: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [6, 100],
                    msg: "Senha deve ter pelo menos 6 caracteres"
                }
            }
        },
        funcao: {
            type: DataTypes.ENUM("admin", "comun"),
            defaultValue: "comun"
        }
    },
    {
        createdAt: "created_at",
        updatedAt: "updated_at",
        hooks: {
            beforeCreate: async (usuario) => {
                const salt = await bcrypt.genSalt(10)
                usuario.senha = await bcrypt.hash(usuario.senha, salt)
            },
            beforeUpdate: async (usuario) => {
                if (usuario.changed("senha")) {
                    const salt = await bcrypt.genSalt(10)
                    usuario.senha = await bcrypt.hash(usuario.senha, salt)
                }
            }
        }
    }
)

export default usuarioModel