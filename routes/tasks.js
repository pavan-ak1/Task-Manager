const express = require('express');
const { getAllTask, createTask, getSingleTask, updateTask, deleteTask } = require('../controllers/task');
const { authenticateUser } = require('../middleware/authMiddleware');
const router = express.Router();

// Apply auth middleware to all task routes
router.use(authenticateUser);

router.route('/').get(getAllTask).post(createTask)
router.route('/:id').get(getSingleTask).patch(updateTask).delete(deleteTask)

module.exports = router;
