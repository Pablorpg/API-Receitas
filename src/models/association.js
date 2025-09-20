import usuarioModel from "./usuarioModel.js"
import receitasModel from "../models/receitasModel.js"
import chefModel from "./chefModel.js"
import refreshTokenModel from "./refreshTokenModel.js"
import favoritaModel from "./favoritaModel.js"

usuarioModel.hasMany(receitasModel, { foreignKey: "usuarioId" })
receitasModel.belongsTo(usuarioModel, { foreignKey: "usuarioId" })

chefModel.hasMany(receitasModel, { foreignKey: "chefId" })
receitasModel.belongsTo(chefModel, { foreignKey: "chefId" })

usuarioModel.hasMany(refreshTokenModel, { foreignKey: "usuarioId" })
refreshTokenModel.belongsTo(usuarioModel, { foreignKey: "usuarioId" })

usuarioModel.hasMany(favoritaModel, { foreignKey: "usuarioId" })
favoritaModel.belongsTo(usuarioModel, { foreignKey: "usuarioId" })
receitasModel.hasMany(favoritaModel, { foreignKey: "receitaId" })
favoritaModel.belongsTo(receitasModel, { foreignKey: "receitaId" })