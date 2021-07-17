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
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      primaryKey: true,
      autoIncrement: true
    },
    admins: {
      type: DataTypes.STRING,
      allowNull: false
    },
    instructor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    classNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tasks: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    tableName: 'courses',
    modelName: 'Course',
  });
  return Course;
};