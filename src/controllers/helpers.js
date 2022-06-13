const { Book, Reader, Genre } = require("../models");

const getModel = (model) => {
  const models = {
    book: Book,
    reader: Reader,
    genre: Genre
  };

  return models[model];
}

const removePassword = (obj) => {
  if(obj.hasOwnProperty("password")) {
    delete obj.password;
  }
  return obj;
}

const createItem = async (res, model, item) => {
  const Model = getModel(model);
  try {
    const newItem = await Model.create(item);
    const removedPasswordItem = removePassword(newItem.dataValues);
    res.status(201).json(removedPasswordItem);
  } catch (error) {
    res.status(400).json({error: error.errors.map(err => err.message)});
  }
}

module.exports = {createItem, removePassword};