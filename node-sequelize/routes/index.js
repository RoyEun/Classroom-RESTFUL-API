var express = require('express');
var router = express.Router();
const classroomController = require('../controllers').classroom;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/classroom', classroomController.list);
router.get('/api/classroom/:id', classroomController.getById);
router.post('/api/classrom', classroomController.add);
router.put('/api/classroom/:id', classroomController.update);
router.delete('api/classroom/:id', classroomController.delete);

module.exports = router;
