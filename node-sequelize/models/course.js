'use strict';
module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define('Course', {
    lecturer_id: DataTypes.INTEGER,
    course_name: DataTypes.STRING
  }, {});
  Course.associate = function(models) {
    Course.belongsToMany(models.Student, {
      through: 'StudentCourse',
      as: 'students',
      foreignKey: 'course_id'
    });
    Course.belongsTo(models.Lecturer);
  };
  return Course;
};
