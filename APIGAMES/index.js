const express = require("express");
const app = express();
const connection = require("./database/Database");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const jwtSecret = "hsjhdfkfjhkjshdfkjsdhfk";

const Game = require("./database/Games");
const User = require("./database/Users");

//Usando cors para http request
app.use(cors());

//Configuração body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Conexão banco de dados
connection
  .authenticate()
  .then(() => {
    console.log("Banco de dados conectado");
  })
  .catch((msgErro) => {
    console.log(msgErro);
  });

function auth(req, res, next) {
  const authToken = req.headers["authorization"];

  if (authToken != undefined) {
    const bearer = authToken.split(" ");
    var token = bearer[1];
    jwt.verify(token, jwtSecret, (err, data) => {
      if (err) {
        res.status(401);
        res.json({ err: "Token inválido!" });
      } else {
        req.token = token;
        req.loggerUser = { id: data.id, email: data.email };
        next();
        console.log(data);
      }
    });
  } else {
    res.status(401);
    res.json({ err: "token inválido" });
  }

  console.log(authToken);
  next();
}

//Rota de listagem de games
app.get("/games", auth, (req, res) => {
  Game.findAll({ raw: true })
    .then((games) => {
      res.statusCode = 200;
      res.json(games);
    })
    .catch((err) => {
      res.sendStatus(500);
      console.log(err);
    });
});

//Rota de listagem de um game

app.get("/game/:id", auth, (req, res) => {
  if (isNaN(req.params.id)) {
    // se o id não for número
    res.sendStatus(400);
  } else {
    var id = parseInt(req.params.id);

    var game = DB.games.find((g) => g.id == id);

    if (game != undefined) {
      res.statusCode = 200;
      res.json(game);
    } else {
      res.sendStatus(404);
    }
  }
});

//rota de cadastro de game

app.post("/game", auth, (req, res) => {
  var { title, price, year } = req.body;

  //se o titulo for nulo ou vazio || ano ou preço não forem números
  if (title == null || title == "" || isNaN(price || year)) {
    res.sendStatus(400);
  } else {
    Game.create({
      title: title,
      price: price,
      year: year,
    })
      .then((result) => {
        res.sendStatus(201);
      })
      .catch((err) => {
        res.sendStatus(500);
        console.log(err);
      });
  }
});

//Deletando game

app.delete("/game/:id", auth, (req, res) => {
  if (isNaN(req.params.id)) {
    // se o id não for um número
    res.sendStatus(400);
  } else {
    //senão

    var id = parseInt(req.params.id);

    Game.destroy({ where: { id: id } })
      .then((result) => {
        if (result == 0) {
          res.sendStatus(404);
        } else {
          res.sendStatus(204);
        }
      })
      .catch((err) => {
        res.sendStatus(500);
      });
  }
});

//Rota para edição de um game

app.put("/game/:id", auth, (req, res) => {
  if (isNaN(req.params.id)) {
    res.sendStatus(400);
  } else {
    var id = parseInt(req.params.id);
    var { title, year, price } = req.body;

    if (title != undefined) {
      Game.update({ title: title }, { where: { id: id } })
        .then()
        .catch((err) => {
          res.sendStatus(500);
        });
    }

    if (year != undefined) {
      //se o ano estiver preenchido
      if (isNaN(year)) {
        //se o ano não for número
        res.sendStatus(400);
      } else {
        Game.update({ year: year }, { where: { id: id } })
          .then()
          .catch((err) => {
            res.sendStatus(500);
          });
      }
    }

    if (price != undefined) {
      // se o preeço não for preenchido
      if (isNaN(price)) {
        //se o preço não for número
        res.sendStatus(400);
      } else {
        Game.update({ price: price }, { where: { id: id } })
          .then()
          .catch((err) => {
            res.sendStatus(500);
          });
      }
    }

    res.sendStatus(204);
  }
});

// rota de cadastro de user
app.post("/user", auth, (req, res) => {
  const { name, email, password } = req.body;

  User.create(
    { name, email, password }
      .then((result) => {
        res.sendStatus(201);
      })
      .catch((err) => {
        res.sendStatus(500);
      })
  );
});

// rota de autenticação

app.post("/auth", (req, res) => {
  const { email, password } = req.body;
  if (email != undefined && password != undefined) {
    // se email e senha forem preenchidos

    User.findOne({ where: { email: email } }).then((user) => {
      if (user != undefined) {
        // se o usuario for encontrado
        if (user.password == password) {
          //se senhas forem iguais
          jwt.sign(
            { id: user.id, email: email },
            jwtSecret,
            {
              expiresIn: "1h",
            },
            (err, token) => {
              if (err) {
                res.status(400);
                res.json({ err: "falha interna" });
              } else {
                res.status(200);
                res.json({ token: token });
              }
            }
          );
        } else {
          res.status(401);
          res.json({ err: "credenciais invalidas!" });
        }
      }
    });
  } else {
    res.status(404);
    res.json({ err: "email ou senha invalidos" });
  }
});

app.listen(45678, () => {
  console.log("API RODANDO");
});
