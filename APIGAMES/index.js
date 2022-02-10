const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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

app.get("/games", (req, res) => {
  res.statusCode = 200;
  res.json(DB.games);
});

app.get("/game/:id", (req, res) => {
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

app.post("/game", (req, res) => {
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

app.delete("/game/:id", (req, res) => {
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

app.put("/game/:id", (req, res) => {
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
      if ((user.password = password)) {
        res.status = 200;
        res.json({ token: "TOKEN FALSO!" });
      } else {
        res.status = 401;
        res.json({ err: "Credenciais inválidas!" });
      }
    }
  } else {
    res.status = 400;
    res.json({ err: "E-mail inválido" });
  }
});

app.listen(45678, () => {
  console.log("API RODANDO");
});
