'use strict';
module.exports = (sequelize, DataTypes) => {
  var Park = sequelize.define('Park', {
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    images: DataTypes.ARRAY(DataTypes.STRING),
    thumbnail: DataTypes.STRING,
    thumbnails: DataTypes.ARRAY(DataTypes.STRING),
    parkCode: DataTypes.STRING,
    description: DataTypes.TEXT,
    lat: DataTypes.STRING,
    lng: DataTypes.STRING,
    states: DataTypes.ARRAY(DataTypes.STRING),
    url: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    },
    instanceMethods: {
      location: function() {
        // lat-lng string
      }
    }
  });
  return Park;
};
