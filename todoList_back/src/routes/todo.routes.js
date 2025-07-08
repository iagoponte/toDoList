const express = require('express');
const router = express.Router();
const toDoListControllers = require('../controllers/toDoListControllers');

router.get('/tasks', toDoListControllers.getToDoList);
router.post('/tasks', toDoListControllers.postToDoList);
router.put('/tasks/:id', toDoListControllers.putToDoList);
router.delete('/tasks', toDoListControllers.deleteToDoList);
router.delete('/tasks/:id', toDoListControllers.deleteToDoListById);
router.get('/tasks/export', toDoListControllers.exportgetToDoList);

module.exports = router;