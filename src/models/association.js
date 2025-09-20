import usuarioModel from "./usuarioModel.js"
import receitasModel from "./receitasModel.js"
import chefModel from "./chefModel.js"
import refreshTokenModel from "./refreshTokenModel.js"
import favoritaModel from "./favoritaModel.js"
import curtidaModel from "./curtidaModel.js"
import comentarioModel from "./comentarioModel.js"

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

usuarioModel.hasMany(curtidaModel, { foreignKey: "usuarioId" })
curtidaModel.belongsTo(usuarioModel, { foreignKey: "usuarioId" })
receitasModel.hasMany(curtidaModel, { foreignKey: "receitaId" })
curtidaModel.belongsTo(receitasModel, { foreignKey: "receitaId" })

usuarioModel.hasMany(comentarioModel, { foreignKey: "usuarioId" })
comentarioModel.belongsTo(usuarioModel, { foreignKey: "usuarioId" })
receitasModel.hasMany(comentarioModel, { foreignKey: "receitaId" })
comentarioModel.belongsTo(receitasModel, { foreignKey: "receitaId" })