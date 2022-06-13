const express = require("express");
const booksController = require("../controllers/books");
const book = require("../models/book");

const router = express.Router();

router.post("/", booksController.create);
router.get("/", booksController.readAll);
router.get("/:bookId", booksController.readById);
router.patch("/:bookId", booksController.update);
router.delete("/:bookId", booksController.destroy);

module.exports = router;