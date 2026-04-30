const Task = require('../models/Task');
const Project = require('../models/Project');

const createTask = async (req, res) => {
  const { title, description, dueDate, priority, status, assignedTo } = req.body;
  const { projectId } = req.params;

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (project.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only admin can create tasks' });
    }

    const task = await Task.create({
      title,
      description,
      dueDate,
      priority,
      status,
      project: projectId,
      assignedTo: assignedTo || null
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTasks = async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const isAdmin = project.admin.toString() === req.user._id.toString();
    const isMember = project.members.includes(req.user._id);

    if (!isAdmin && !isMember) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    let query = { project: projectId };
    
    // STRICT RBAC: Members can ONLY view tasks assigned to them
    if (!isAdmin) {
      query.assignedTo = req.user._id;
    }

    const tasks = await Task.find(query).populate('assignedTo', 'name email');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTaskStatus = async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  try {
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const project = await Project.findById(task.project);
    const isAdmin = project.admin.toString() === req.user._id.toString();
    const isAssigned = task.assignedTo && task.assignedTo.toString() === req.user._id.toString();

    if (!isAdmin && !isAssigned) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    task.status = status;
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const project = await Project.findById(task.project);
    if (project.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only admin can delete tasks' });
    }

    await task.deleteOne();
    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTask = async (req, res) => {
  const { title, description, dueDate, priority, assignedTo } = req.body;
  const { id } = req.params;

  try {
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const project = await Project.findById(task.project);
    if (project.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only admin can update task details' });
    }

    task.title = title || task.title;
    task.description = description !== undefined ? description : task.description;
    task.dueDate = dueDate || task.dueDate;
    task.priority = priority || task.priority;
    task.assignedTo = assignedTo || task.assignedTo;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createTask, getTasks, updateTaskStatus, updateTask, deleteTask };
