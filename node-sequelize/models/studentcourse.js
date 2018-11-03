'use strict';
module.exports = (sequelize, DataTypes) => {
  const StudentCourse = sequelize.define('StudentCourse', {
    student_id: DataTypes.INTEGER,
    course_id: DataTypes.INTEGER
  }, {});
  StudentCourse.associate = function(models) {

  };
  return StudentCourse;
};
