const Task = require('../models/task')

const getAllTask = async (req, res) => {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ msg: 'Authentication required' });
        }
        const tasks = await Task.find({ user: req.user.userId });
        res.status(200).json({ tasks });
    } catch (error) {
        console.error('Error getting tasks:', error);
        res.status(500).json({ msg: 'There was an error occurred' });
    }
}

const createTask = async (req, res) => {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ msg: 'Authentication required' });
        }
        req.body.user = req.user.userId;
        const task = await Task.create(req.body);
        res.status(201).json({ task });
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ msg: 'There was an error occurred' });
    }
}

const getSingleTask = async (req, res) => {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ msg: 'Authentication required' });
        }
        const { id: taskID } = req.params;
        const task = await Task.findOne({ _id: taskID, user: req.user.userId });
        if (!task) {
            return res.status(404).json({ msg: `No task with ID: ${taskID}` });
        }
        res.status(200).json({ task });
    } catch (error) {
        console.error('Error getting single task:', error);
        res.status(500).json({ msg: 'There was an error occurred' });
    }
}

const deleteTask = async (req, res) => {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ msg: 'Authentication required' });
        }
        const { id: taskID } = req.params;
        const task = await Task.findOneAndDelete({ _id: taskID, user: req.user.userId });
        if (!task) {
            return res.status(404).json({ msg: `The task does not exist: ${taskID}` });
        }
        res.status(200).json({ task });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ msg: 'There was an error occurred' });
    }
}

const updateTask = async (req, res) => {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ msg: 'Authentication required' });
        }
        const { id: taskID } = req.params;
        const task = await Task.findOneAndUpdate(
            { _id: taskID, user: req.user.userId },
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );
        if (!task) {
            return res.status(404).json({ msg: `No task with ID: ${taskID}` });
        }
        res.status(200).json({ task });
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ msg: 'There was an error occurred' });
    }
}

module.exports = { getAllTask, createTask, getSingleTask, updateTask, deleteTask }