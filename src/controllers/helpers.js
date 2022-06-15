const { Book, Reader, Genre, Author } = require("../models");

const getModel = (model) => {
  const models = {
    book: Book,
    reader: Reader,
    genre: Genre,
    author: Author
  };
  
  return models[model];
}

const get404Error = (model) => ({error: `The ${model} could not be found`});

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

const getItemById = (res, model, id) => {
  const Model = getModel(model);

  return Model.findByPk(id, {includes: Genre}).then((item) => {
    if (!item) {
      res.status(404).json(get404Error(model));
    } else {
      const itemWithoutPassword = removePassword(item.dataValues);
      res.status(200).json(itemWithoutPassword);
    }
  });
};


module.exports = {createItem, removePassword, getItemById};