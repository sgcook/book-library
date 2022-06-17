const req = require("express/lib/request");
const res = require("express/lib/response");
const { Book, Reader, Genre, Author } = require("../models");

const get404Error = (model) => ({error: `The ${model} could not be found`});

const getModel = (model) => {
  const models = {
    book: Book,
    reader: Reader,
    genre: Genre,
    author: Author
  };
  return models[model];
}

const getOptions = (model) => {
  if (model === "book") return {include: Genre} 
  if (model === "genre") return {include: Book}
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
    const errorMessages = error.errors.map((e) => e.message);
    res.status(400).json({errors: errorMessages});
  }
}

const getAllItems = async (res, model) => {
  const Model = getModel(model);

  const options = getOptions(model);

  const items = await Model.findAll({...options});

  const itemsWithoutPassword = items.map((item) => {
    return removePassword(item.dataValues);
  });

  res.status(200).json(itemsWithoutPassword);
}

const getItemById = async (res, model, id) => {
  const Model = getModel(model);

  const options = getOptions(model);

  const item = await Model.findByPk(id, {...options});
  
  if (!item) {
    res.status(404).json(get404Error(model));
  } else {
    const itemWithoutPassword = removePassword(item.dataValues);
    res.status(200).json(itemWithoutPassword);
  }
};

const updateItem = async (res, model, item, id) => {
  const Model = getModel(model);

  const [ updatedRows ] = await Model.update(item, {where: {id: id}});

  if(!updatedRows) {
    res.status(404).json(get404Error(model));
  } else {
    const updatedItem = await Model.findByPk(id);
    const itemWithoutPassword = removePassword(updatedItem.dataValues);
    res.status(200).json(itemWithoutPassword);
  }
}

const deleteItem = async (res, model, id) => {
  const Model = getModel(model);
  const deletedRows = await Model.destroy({ where: {id: id }});

  if(deletedRows) {
    res.status(204).send();
  } else {
    res.status(404).send(get404Error(model));
  }
}


module.exports = {createItem, removePassword, getAllItems,getItemById, updateItem, deleteItem};