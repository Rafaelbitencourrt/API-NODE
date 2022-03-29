const express = require("express");
const cors = require("cors");
const app = express();

const corOptions = {
  origin: "https://localhost:8081", //link de acesso a todas informações da API
};

//MIDLEWARE

app.use(cors(corOptions));

app.use(express.json()); //config para rebeber info json

app.use(express.urlencoded({ extended: true })); //analisa informações do corpo e cabeçalho do request.body

//TEST API

app.get("/", (req, res) => {
  res.json({ message: "Hello from api" });
});

//PORT

const PORT = process.env.PORT || 8080;

//SERVER

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
