const express = require('express');
const authenticateToken = require('../middleware/authMiddleware');
const Project = require('../models/Project');

const router = express.Router();

// Create Project
router.post('/', authenticateToken, async (req, res) => {
  const { title, description } = req.body;
  try {
    const newProject = new Project({ title, description, owner: req.user.id });
    await newProject.save();
    res.status(201).json(newProject);
  } catch (error) {
    res.status(400).send('Error: ' + error.message);
  }
});

// Get All Projects
router.get('/', authenticateToken, async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user.id }).populate('tasks');
    res.json(projects);
  } catch (error) {
    res.status(400).send('Error: ' + error.message);
  }
});

// Update Project
router.put('/:id', authenticateToken, async (req, res) => {
  const { title, description } = req.body;
  try {
    const updatedProject = await Project.findByIdAndUpdate(req.params.id, { title, description }, { new: true });
    res.json(updatedProject);
  } catch (error) {
    res.status(400).send('Error: ' + error.message);
  }
});

// Delete Project
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.send('Project Deleted');
  } catch (error) {
    res.status(400).send('Error: ' + error.message);
  }
});

module.exports = router;
