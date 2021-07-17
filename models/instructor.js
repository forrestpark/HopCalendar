'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Instructor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Instructor.init({
    id: DataTypes.INTEGER,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    courses: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'instructors',
    modelName: 'Instructor',
  });
  return Instructor;
};