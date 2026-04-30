const Task = require('../models/Task');
const Project = require('../models/Project');

const getDashboardStats = async (req, res) => {
  const { projectId } = req.query;

  try {
    let projectIds = [];

    if (projectId) {
      const project = await Project.findById(projectId);
      if (!project) return res.status(404).json({ message: 'Project not found' });
      
      const isAdmin = project.admin.toString() === req.user._id.toString();
      const isMember = project.members.includes(req.user._id);

      if (!isAdmin && !isMember) return res.status(403).json({ message: 'Not authorized' });
      projectIds.push(projectId);
    } else {
      const projects = await Project.find({
        $or: [{ admin: req.user._id }, { members: req.user._id }]
      });
      projectIds = projects.map(p => p._id);
    }

    const tasks = await Task.find({ project: { $in: projectIds } }).populate('assignedTo', 'name');

    const totalTasks = tasks.length;
    const statusCounts = { 'To Do': 0, 'In Progress': 0, 'Done': 0 };
    let overdueTasks = 0;
    const now = new Date();
    const tasksPerUser = {};

    tasks.forEach(task => {
      if (task.status) {
        statusCounts[task.status] = (statusCounts[task.status] || 0) + 1;
      }

      if (task.dueDate && new Date(task.dueDate) < now && task.status !== 'Done') {
        overdueTasks++;
      }

      if (task.assignedTo) {
        const userName = task.assignedTo.name;
        tasksPerUser[userName] = (tasksPerUser[userName] || 0) + 1;
      }
    });

    res.json({
      totalTasks,
      statusCounts,
      overdueTasks,
      tasksPerUser
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats };
