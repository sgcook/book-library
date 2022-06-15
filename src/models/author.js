module.exports = (connection, DataTypes) => {
  const schema = {
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validation: {
        notNull: {
          args: [true],
          msg: "We need an author in so that we can create one",
        },
        notEmpty: {
          args: [true],
          msg: "We need an author in so that we can create one",
        },
      },
    },
  };

  const AuthorModel = connection.define("Author", schema);
  return AuthorModel;
}