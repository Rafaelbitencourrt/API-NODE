const express = require("express");
const app = express();
const connection = require("./database/Database");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const jwtSecret = "hsjhdfkfjhkjshdfkjsdhfk";

const Game = require("./games/Games");

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Database

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

var DB = {
  games: [
    {
      id: 23,
      title: "Call of Dutty",
      year: 2019,
      price: 60,
    },
    {
      id: 65,
      title: "Sea of thieves",
      year: 2018,
      price: 45,
    },
    {
      id: 2,
      title: "God of war",
      year: 2012,
      price: 13,
    },
  ],

  users: [
    {
      id: 1,
      name: "Rafael Bitencourt Oliveira",
      email: "rafaelbitencourrt@gmail.com",
      password: "28461973",
    },
    {
      id: 2,
      name: "Michelle Lopes",
      email: "miichelle.lopes@gmail.com",
      password: "297657",
    },
  ],
};

app.get("/games", auth, (req, res) => {
  res.statusCode = 200;
  res.json(DB.games);
});

app.get("/game/:id", auth, (req, res) => {
  if (isNaN(req.params.id)) {
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

//cadastro de dados

app.post("/game", auth, (req, res) => {
  var { title, price, year } = req.body;

  if (isNaN(price || year)) {
    res.sendStatus(400);
  }
  if (title == undefined) {
    res.sendStatus(400);
  } else {
    DB.games.push({
      id: 2323,
      title: "top gear",
      price: 60,
      year: 1996,
    });
  }
  res.sendStatus(200);
});

//DELETANDO DADOS

app.delete("/game/:id", auth, (req, res) => {
  if (isNaN(req.params.id)) {
    res.sendStatus(400);
  } else {
    var id = parseInt(req.params.id);
    var index = DB.games.findIndex((g) => g.id == id);

    if (index == -1) {
      res.sendStatus(404);
    } else {
      DB.games.splice(index, 1);
      res.sendStatus(200);
    }
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
