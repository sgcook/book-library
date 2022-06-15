module.exports = (connection, DataTypes) => {
  const schema = {
    genre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
  };
  
  const GenreModel = connection.define("Genre", schema);
  return GenreModel;
}