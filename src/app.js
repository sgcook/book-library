const express = require('express');
const readersController = require("./controllers/readers");

const router = express.Router();

const app = express();

app.use(express.json());

app.post("/readers", readersController.create);
app.get("/readers", readersController.readAll);
app.get("/readers/:readerId", readersController.readById);

module.exports = app;