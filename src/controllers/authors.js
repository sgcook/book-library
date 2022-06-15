const { Author } = require("../models");
const { createItem, getItemById } = require("./helpers");

exports.create = (req, res) => createItem(res, "author", req.body);

exports.readAll = async (req, res) => {
  const authors = await Author.findAll({where: req.query});
  res.status(200).json(authors);
}

exports.readById = (req, res) => getItemById(res, "author", req.params.id);
// {
//   const {authorId} = req.params;
//  const author = await Author.findByPk(authorId);

//   if(!author) {
//     res.status(404).json({error: "The author could not be found"});
//   } else {
//     res.status(200).json(author);
//   }
// }

exports.update = async (req, res) => {
  const {authorId} = req.params;
  const updateData = req.body;
  const [ updatedRows ] = await Author.update(updateData, {where: {id: authorId}});

  if(!updatedRows) {
    res.status(404).json({error: "The author could not be found"});
  } else {
    res.status(200).send();
  }
}

exports.destroy = async (req, res) => {
  const {authorId} = req.params;
  const deletedRows = await Author.destroy({ where: {id: authorId} });

  if(deletedRows) {
    res.status(204).send();
  } else {
    res.status(404).send({error: "The author could not be found"});
  }
}