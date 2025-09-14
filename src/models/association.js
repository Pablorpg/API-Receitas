import receitasModel from "./receitasModel.js";
import chefModel from "./chefModel.js";

receitasModel.belongsToMany(chefModel, {
  through: "ReceitaChefs",
  foreignKey: "receitaId",
  otherKey: "chefId",
  as: "chefs",
});

chefModel.belongsToMany(receitasModel, {
  through: "ReceitaChefs",
  foreignKey: "chefId",
  otherKey: "receitaId",
  as: "receitas",
});

(async () => {
  await conn.sync({ force: false });
})();