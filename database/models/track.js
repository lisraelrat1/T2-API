'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Track extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Track.init({
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    name: DataTypes.STRING,
    duration: DataTypes.FLOAT,
    times_played: DataTypes.INTEGER,
    album_id: DataTypes.STRING,
    artist_id: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Track',
    timestamps: false,
  });
  Track.associate = function(models) {
    Track.belongsTo(models.Artist, {
      foreignKey: 'artist_id',
      as: 'artist'
    });
    Track.belongsTo(models.Album, {
      foreignKey: 'album_id',
      as: 'album'
    })
  };

  return Track;
};