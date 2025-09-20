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
                    args: [8, 100],
                    msg: "Senha deve ter pelo menos 8 caracteres"
                },
                is: {
                    args: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    msg: "Senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial"
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