module.exports = (connection, DataTypes) => {
  const schema = {
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  };

  const AuthorModel = connection.define("Author", schema);
  return AuthorModel;
}