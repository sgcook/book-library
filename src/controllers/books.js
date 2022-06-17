const { Book } = require("../models");
const {createItem, getItemById, updateItem, deleteItem, getAllItems} = require("./helpers");

exports.create = (req, res) => createItem(res, "book", req.body);

exports.readAll = (req, res) => getAllItems(res, "book");

exports.readById = (req, res) => getItemById(res, "book", req.params.bookId);

exports.update = (req, res) => updateItem(res, "book", req.body, req.params.bookId);

exports.destroy = (req, res) => deleteItem(res, "book", req.params.bookId);