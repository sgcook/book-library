const { Genre } = require("../models");
const genre = require("../models/genre");
const {createItem, getItemById, updateItem, deleteItem, getAllItems} = require("./helpers");

exports.create = (req, res) => createItem(res, "genre", req.body);

exports.readAll = (req, res) => getAllItems(res, "genre");

exports.readById = (req, res) => getItemById(res, "genre", req.params.genreId);

exports.update = (req, res) => updateItem(res, "genre", req.body, req.params.genreId);

exports.destroy = (req, res) => deleteItem(res, "genre", req.params.genreId);