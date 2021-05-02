'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Album extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Album.init({
    id: { 
      type: DataTypes.STRING, 
      primaryKey: true
    },
    name: DataTypes.STRING,
    genre: DataTypes.STRING,
    artist_id: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Album',
    timestamps: false,
  });

  Album.associate = function(models) {
    Album.hasMany(models.Track, {
      foreignKey: 'album_id',
      as: 'tracks', 
      onDelete: 'CASCADE',
      hooks: true, 
    });
    Album.belongsTo(models.Artist, {
      foreignKey: 'artist_id',
      as: 'artist',
      onDelete: 'CASCADE',
      hooks: true,
    })
  };

  return Album;
};