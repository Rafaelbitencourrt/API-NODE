const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { status } = require("express/lib/response");
const { response } = require("express");

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

  if (isNaN(req.body.price || req.body.year)) {
    res.sendStatus(400);
  } else {
    DB.games.push({
      id: 2323,
      title: "top gear",
      price: 60,
      year: 1996,
    });
  }
});

app.listen(45678, () => {
  console.log("API RODANDO");
});
