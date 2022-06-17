const { Author } = require("../models");
const { createItem, getItemById, getAllItems, updateItem, deleteItem } = require("./helpers");

exports.create = (req, res) => createItem(res, "author", req.body);

exports.readAll = (req, res) => getAllItems(res, "author");

exports.readById = (req, res) => getItemById(res, "author", req.params.authorId);

exports.update = (req, res) => updateItem(res, "author", req.body, req.params.authorId);

exports.destroy = (req, res) => deleteItem(res, "author", req.params.authorId);