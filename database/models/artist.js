'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Artist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Artist.init({
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    name: DataTypes.STRING,
    age: DataTypes.INTEGER,
    // albums: DataTypes.STRING,
    // tracks: DataTypes.STRING,
    // self: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Artist',
  });

  Artist.associate = function(models) {
    Artist.hasMany(models.Album, { 
      foreignKey: 'artist_id',
      as: 'albums',
      onDelete: 'CASCADE',
    });
    Artist.hasMany(models.Track, { 
      foreignKey: 'artist_id',
      as: 'tracks', 
      onDelete: 'CASCADE',
    });
  };

  return Artist;
};