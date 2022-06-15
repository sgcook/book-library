const express = require("express");
const readersRouter = require("./routes/readersRouter");
const booksRouter = require("./routes/booksRouter");
const genresRouter = require("./routes/genresRouter");
const authorsRouter = require("./routes/authorsRouter");

const app = express();

app.use(express.json());

app.use("/readers", readersRouter);
app.use("/books", booksRouter);
app.use("/genres", genresRouter);
app.use("/authors", authorsRouter);

module.exports = app;