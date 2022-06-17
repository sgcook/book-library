const { Book } = require("../models");
const {createItem, getItemById} = require("./helpers");

exports.create = (req, res) => createItem(res, "book", req.body);

exports.readAll = async (req, res) => {
  const books = await Book.findAll({where: req.query});
  res.status(200).json(books);
}

exports.readById = (req, res) => getItemById(res, "book", req.params.bookId);

exports.update = async (req, res) => {
  const {bookId} = req.params;
  const updateData = req.body;
  const [ updatedRows ] = await Book.update(updateData, {where: { id: bookId }})

  if(!updatedRows) {
    res.status(404).json({ error: "The book could not be found" });
  } else {
    res.status(200).send();
  }
}

exports.destroy = async (req, res) => {
  const {bookId} = req.params;
  const deletedRows = await Book.destroy({where: { id: bookId }});

  if(deletedRows) {
    res.status(204).send();
  } else {
    res.status(404).send({ error: "The book could not be found" });
  }
}