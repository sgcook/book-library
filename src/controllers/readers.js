const { Reader } = require("../models");
const { createItem, removePassword, getItemById } = require("./helpers");

exports.create = (req, res) => createItem(res, "reader", req.body);

exports.readAll = async (req, res) => {
  const readers = await Reader.findAll({where: req.query});
  const removedPasswordReaders = readers.map(reader => removePassword(reader.dataValues));
  res.status(200).json(removedPasswordReaders);
}

exports.readById = (req, res) => getItemById(res, "author", req.params.id);
// {
//   const {readerId} = req.params;
//   const reader = await Reader.findByPk(readerId);
  
//   if(!reader) {
//     res.status(404).json({error: "The reader could not be found"});
//   } else {
//     const removedPasswordReader = removePassword(reader.dataValues);
//     res.status(200).json(removedPasswordReader);
//   }
// }

exports.update = async (req, res) => {
  const { readerId } = req.params;
  const updateData = req.body;
  const [ updatedRows ] = await Reader.update(updateData, {where:{ id: readerId } });
  if(!updatedRows) {
    res.status(404).json({error: "The reader could not be found" });
  } else {
    const updatedItem = await Reader.findByPk(readerId);
    const passwordRemoved = removePassword(updatedItem.dataValues);
    res.status(200).json(passwordRemoved);
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