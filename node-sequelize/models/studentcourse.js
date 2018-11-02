'use strict';
module.exports = (sequelize, DataTypes) => {
  const StudentCourse = sequelize.define('StudentCourse', {
    student_id: DataTypes.INTEGER,
    course: DataTypes.INTEGER
  }, {});
  StudentCourse.associate = function(models) {
    // associations can be defined here
  };
  return StudentCourse;
};