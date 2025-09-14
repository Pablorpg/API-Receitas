import { DataTypes } from "sequelize";
import { conn } from "../config/sequelize.js";

const receitasModel = conn.define(
  "receitas",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descricao: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ingredientes: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    modoPreparo: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    tempoPreparo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    porcoes: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    dificuldade: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "receitas",
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default receitasModel;