const { Reader } = require("../models");
const { createItem, removePassword, getItemById, deleteItem, updateItem, getAllItems } = require("./helpers");

exports.create = (req, res) => createItem(res, "reader", req.body);

exports.readAll = (req, res) => getAllItems(res, "reader");

exports.readById = (req, res) =>  getItemById(res, "reader", req.params.readerId);

exports.update = (req, res) => updateItem(res, "reader", req.body, req.params.readerId);

exports.destroy = (req, res) => deleteItem(res, "reader", req.params.readerId);