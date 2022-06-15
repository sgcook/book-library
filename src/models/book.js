module.exports = (connection, DataTypes) => {
  const schema = {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validation: {
        notNull: {
          args: [true],
          msg: "We need a book title",
        },
        notEmpty: {
          args: [true],
          msg: "The book title cannot be empty",
        },
      },
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ISBN: {
      type: DataTypes.STRING,
    },
  };

  const BookModel = connection.define("Book", schema);
  return BookModel;
}