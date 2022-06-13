const { Reader } = require("../models");

exports.create = async (req, res) => {
  try {
   const newReader = await Reader.create(req.body);
   res.status(201).json(newReader);
 } catch (error) {
   res.status(400).json({error: error.errors.map(err => err.message)});
 }
}

exports.readAll = async (req, res) => {
  const readers = await Reader.findAll({where: req.query});
  res.status(200).json(readers);
}

exports.readById = async (req, res) => {
  const {readerId} = req.params;
  const reader = await Reader.findByPk(readerId);
  if(!reader) {
    res.status(404).json({error: "The reader could not be found"});
  } else {
    res.status(200).json(reader);
  }
}

exports.update = async (req, res) => {
  const { readerId } = req.params;
  const updateData = req.body;    const [ updatedRows ] = await Reader.update(updateData, {where:{ id: readerId } });
  if(!updatedRows) {
    res.status(404).json({error: "The reader could not be found" });
  } else {
    res.status(200).send();
  }
}

exports.destroy = async (req, res) => {
  const { readerId } = req.params;
  const deletedRows = await Reader.destroy({ where: { id: readerId } });
  if(deletedRows) {
    res.status(204).send();
  } else {
    res.status(404).send({ error: "The reader could not be found" });
  }
}