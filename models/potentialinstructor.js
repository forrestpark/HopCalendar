'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PotentialInstructor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  PotentialInstructor.init({
    id: DataTypes.INTEGER,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    courses: DataTypes.STRING,
    courseNumbers: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'PotentialInstructor',
  });
  return PotentialInstructor;
};