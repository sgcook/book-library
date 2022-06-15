const { Genre } = require("../models");
const genre = require("../models/genre");
const {createItem, getItemById} = require("./helpers");

exports.create = (req, res) => createItem(res, "genre", req.body);

exports.readAll = async (req, res) => {
  const genres = await Genre.findAll({ where: req.query });
  res.status(200).json(genres);
}

exports.readById = (req, res) => getItemById(res, "author", req.params.id);
// {
//   const {genreId} = req.params;
//   const genre = await Genre.findByPk(genreId);

//   if(!genre) {
//     res.status(404).json({error: "The genre could not be found"});
//   } else {
//     res.status(200).json(genre);
//   }
// }

exports.update = async (req, res) => {
  const {genreId} = req.params;
  const updateData = req.body;
  const [ updatedRows ] = await Genre.update(updateData, {where: {id: genreId}});

  if(!updatedRows) {
    res.status(404).json({error: "The genre could not be found"});
  } else {
    res.status(200).send();
  }
}

exports.destroy = async (req, res) => {
  const {genreId} = req.params;
  const deletedRows = await Genre.destroy({ where: {id: genreId }});

  if(deletedRows) {
    res.status(204).send();
  } else {
    res.status(404).send({error: "The genre could not be found"});
  }
}