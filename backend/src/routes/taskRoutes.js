const express = require('express');
const { createTask, getTasks, updateTaskStatus, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router({ mergeParams: true });

router.route('/').post(protect, createTask).get(protect, getTasks);
router.route('/:id/status').put(protect, updateTaskStatus);
router.route('/:id').delete(protect, deleteTask).put(protect, updateTask);

module.exports = router;
