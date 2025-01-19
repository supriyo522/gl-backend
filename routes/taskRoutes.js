const express = require('express');
const authenticateToken = require('../middleware/authMiddleware');
const Task = require('../models/Task');
const Project = require('../models/Project');

const router = express.Router();

// Create Task
router.post('/', authenticateToken, async (req, res) => {
  const { title, description, status, deadline, assignedUser, project } = req.body;
  try {
    const newTask = new Task({ title, description, status, deadline, assignedUser, project });
    await newTask.save();
    await Project.findByIdAndUpdate(project, { $push: { tasks: newTask._id } });
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).send('Error: ' + error.message);
  }
});

// Get Tasks
router.get('/', authenticateToken, async (req, res) => {
  const { status, assignedUser } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (assignedUser) filter.assignedUser = assignedUser;

  try {
    const tasks = await Task.find(filter).populate('assignedUser');
    res.json(tasks);
  } catch (error) {
    res.status(400).send('Error: ' + error.message);
  }
});

module.exports = router;
