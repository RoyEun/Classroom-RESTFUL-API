const Student = require('../models').Student;
const Classroom = require('../models').Classroom;
const Course = require('../models').Course;
const StudentCourse = require('../models').StudentCourse;
const Lecturer = require('../models').Lecturer;

module.exports = {
  list(req, res) {
    return Student.sequelize.query('SELECT * FROM Public."Students" AS a INNER JOIN Public."Classrooms" AS b ON a.classroom_id = b.id', {model: Student})
       .then((students) => {
         return res.status(200).send(students.map((student) => {
           let nestedClassroom = {};
           let studentObj = student["dataValues"];

           for (const item in studentObj) {
             if (item === "classroom_id" || item === "class_name") {
               nestedClassroom[item] = studentObj[item];
               delete studentObj[item];
             }
           }

           studentObj["classroom"] = nestedClassroom;
           return student;
         }));
       })
       .catch((error) => { res.status(400).send(error); });
  },

  listAll(req, res) {
    return Student.sequelize.query('SELECT sc.student_id, sc.course_id, s.classroom_id, s.student_name, c.id, c.lecturer_id, c.course_name, l.id, l.lecturer_name, cl.id, cl.class_name AS classroom_name FROM PUBLIC."Students" s LEFT JOIN PUBLIC."StudentCourses" sc ON sc.student_id = s.id LEFT JOIN PUBLIC."Courses" c ON sc.course_id = c.id LEFT JOIN PUBLIC."Lecturers" l ON c.lecturer_id = l.id LEFT JOIN PUBLIC."Classrooms" cl ON s.classroom_id = cl.id;', {
      model: Student, Classroom, Course, StudentCourse, Lecturer
    })
      .then((students) => {
        return res.status(200).send(students.map((student) => {
          let nestedCourses = [{}];
          let studentObj = student["dataValues"];

          for (const item in studentObj) {
            if (item === "course_id" || item === "course_name" || item === "lecturer_name" || item === "lecturer_id") {
              nestedCourses[0][item] = studentObj[item];
              delete studentObj[item];
            }
          }

          studentObj["courses"] = nestedCourses;
          return student;
        }))
      })
      .catch((error) => { res.status(400).send(error); });
  },

  getById(req, res) {
    // NEED TO COMPLETE INNERJOIN FOR STUDENTCOURSE;
    return Student.sequelize.query(`SELECT * FROM Public."Students" WHERE Public."Students".id = ${req.params.id}`, {model: Student})
        .then((student) => {
          if (!student.length) {
            return res.status(404).send({
              message: 'Student not Found',
            });
          }
          return res.status(200).send(student);
        })
        .catch((error) => { res.status(400).send(error); });
  },

  add(req, res) {
    return Student
      .create({
        classroom_id: req.body.classroom_id,
        student_name: req.body.student_name,
      })
      .then((student) => res.status(201).send(student))
      .catch((error) => res.status(400).send(error));
  },

  addCourse(req, res) {
    return Student
      .findById(req.body.student_id, {
        include: [{
          model: Classroom,
          as: 'classroom'
        },{
          model: Course,
          as: 'courses'
        }],
      })
      .then((student) => {
        if (!student) {
          return res.status(404).send({
            message: 'Student Not Found',
          });
        }
        Course.findById(req.body.course_id).then((course) => {
          if (!course) {
            return res.status(404).send({
              message: 'Course Not Found',
            });
          }
          student.addCourse(course);
          return res.status(200).send(student);
        })
      })
      .catch((error) => res.status(400).send(error));
  },

  update(req, res) {
    return Student.sequelize.query(`SELECT * FROM PUBLIC."Students" WHERE PUBLIC."Students".id = ${req.params.id}`, {model: Student})
      .then(student => {
        if (!student) {
          return res.status(404).send({
            message: 'Student Not Found',
          });
        }
        return Student
          .update({
            student_name: req.body.student_name,
            classroom_id: req.body.classroom_id || student.classroom_id
          }, {
            where: { id: req.params.id }
          })
          .then(() => res.status(200).send(student))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  delete(req, res) {
    return Student
      .findById(req.params.id)
      .then(student => {
        if (!student) {
          return res.status(400).send({
            message: 'Student Not Found',
          });
        }
        return student
          .destroy()
          .then(() => res.status(204).send())
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
};
