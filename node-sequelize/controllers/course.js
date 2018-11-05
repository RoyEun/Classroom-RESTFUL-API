const Course = require('../models').Course;
const Student = require('../models').Student;
const Lecturer = require('../models').Lecturer;

module.exports = {
  list(req, res) {
    //NEED TO COMPLETE INNER JOIN FOR STUDENT COURSE AND DESC ORDER
    return Course.sequelize.query('SELECT * FROM Public."Courses"', {model: Course})
       .then((course) => res.status(200).send(course))
       .catch((error) => { res.status(400).send(error); });
  },

  getById(req, res) {
    //NEED TO COMPLETE INNER JOIN FOR STUDENTCOURSE;
    return Course.sequelize.query(`SELECT * FROM Public."Courses" WHERE Public."Courses".id = ${req.params.id}`, {model: Course})
       .then((course) => {
         if (!course.length) {
           return res.status(404).send({
             message: 'Course not Found',
           });
         }
         return res.status(200).send(course);
       })
       .catch((error) => { res.status(400).send(error); });
  },

  add(req, res) {
    return Course
      .create({
        course_name: req.body.course_name,
      })
      .then((course) => res.status(201).send(course))
      .catch((error) => res.status(400).send(error));
  },

  update(req, res) {
    return Course.sequelize.query(`SELECT * FROM PUBLIC."Courses" WHERE PUBLIC."Courses".id = ${req.params.id}`, {model: Course})
      .then(course => {
        if (!course) {
          return res.status(404).send({
            message: 'Course Not Found',
          });
        }
        return Course
          .update({
            course_name: req.body.course_name,
            lecturer_id: req.body.lecturer_id || course.course_name
          }, {
            where: { id: req.params.id }
          })
          .then(() => res.status(200).send(course))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  delete(req, res) {
    return Course
      .findById(req.params.id)
      .then(course => {
        if (!course) {
          return res.status(400).send({
            message: 'Course Not Found',
          });
        }
        return course
          .destroy()
          .then(() => res.status(204).send())
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
};
