const express = require('express');
const { createProject, getProjects, getProjectById, addMember, removeMember } = require('../controllers/projectController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();
const taskRoutes = require('./taskRoutes');

router.use('/:projectId/tasks', taskRoutes);

router.route('/').post(protect, createProject).get(protect, getProjects);
router.route('/:id').get(protect, getProjectById);
router.route('/:id/members').post(protect, addMember);
router.route('/:id/members/:userId').delete(protect, removeMember);

module.exports = router;
