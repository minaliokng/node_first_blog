const express = require('express');
const app = express();
const router = express.Router();
const port = 3000;

const cookieParser = require('cookie-parser');

const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output");
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(express.json());
app.use(cookieParser());

const indexRouter = require("./routes/index");
app.use("/api", [indexRouter]);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});