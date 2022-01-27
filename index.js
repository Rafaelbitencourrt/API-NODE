const express = require("express");
const app = express();
const bodyParser = require("body-parser");

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

app.get("/", () => {});

app.listen(45678, () => {
  console.log("API RODANDO");
});
