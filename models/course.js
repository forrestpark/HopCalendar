'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Course.init({
    id: DataTypes.INTEGER,
    admins: DataTypes.STRING,
    instructor: DataTypes.STRING,
    classNumber: DataTypes.STRING,
    tasks: DataTypes.STRING,
    name: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'courses',
    modelName: 'Course',
  });
  return Course;
};