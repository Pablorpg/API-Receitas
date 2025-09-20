import usuarioModel from "./usuarioModel.js"
import receitaModel from "./receitaModel.js"
import chefModel from "./chefModel.js"
import refreshTokenModel from "./refreshTokenModel.js"
import favoritaModel from "./favoritaModel.js"

usuarioModel.hasMany(receitaModel, { foreignKey: "usuarioId" })
receitaModel.belongsTo(usuarioModel, { foreignKey: "usuarioId" })

chefModel.hasMany(receitaModel, { foreignKey: "chefId" })
receitaModel.belongsTo(chefModel, { foreignKey: "chefId" })

usuarioModel.hasMany(refreshTokenModel, { foreignKey: "usuarioId" })
refreshTokenModel.belongsTo(usuarioModel, { foreignKey: "usuarioId" })

usuarioModel.hasMany(favoritaModel, { foreignKey: "usuarioId" })
favoritaModel.belongsTo(usuarioModel, { foreignKey: "usuarioId" })
receitaModel.hasMany(favoritaModel, { foreignKey: "receitaId" })
favoritaModel.belongsTo(receitaModel, { foreignKey: "receitaId" })