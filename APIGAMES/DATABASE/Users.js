const Sequelize = require("sequelize");
const connection = require("./Database");

const user = connection.define("users", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

//Caso a tabela ainda não tenha sido criada
//user.sync({ force: false });

module.exports = user;
