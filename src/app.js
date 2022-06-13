const express = require("express");
const readersRouter = require("./routes/readersRouter");
const booksRouter = require("./routes/booksRouter");

const app = express();

app.use(express.json());

app.use("/readers", readersRouter);
app.use("/books", booksRouter);

module.exports = app;