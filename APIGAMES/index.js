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

//EDIÇÃO DE DADOS

app.put("/game/:id", auth, (req, res) => {
  if (isNaN(req.params.id)) {
    res.sendStatus(400);
  } else {
    var id = parseInt(req.params.id);

    var game = DB.games.find((g) => g.id == id);

    if (game != undefined) {
      var { title, price, year } = req.body;

      if (title != undefined) {
        game.title = title;
      }

      if (price != undefined) {
        game.price = price;
      }

      if (year != undefined) {
        game.year = year;
      }

      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  }
});

app.post("/auth", (req, res) => {
  var { email, password } = req.body;

  if (email != undefined) {
    var user = DB.users.find((u) => u.email == email);

    if (user != undefined) {
      if (user.password == password) {
        jwt.sign(
          { id: user.id, email: user.email },
          jwtSecret,
          {
            expiresIn: "48h",
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
        res.json({ err: "Credenciais inválidas!" });
      }
    } else {
      res.status(404);
      res.json({ err: "O email enviado não existe na base de dados" });
    }
  } else {
    res.status(400);
    res.json({ err: "E-mail inválido" });
  }
});

app.listen(45678, () => {
  console.log("API RODANDO");
});
