const Sequelize = require("sequelize");
const connection = require("../database/Database");

const Game = connection.define("games", {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  slug: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  price: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  year: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

//Caso a tabela ainda não tenha sido criada
//Game.sync({ force: false });

module.exports = Game;
