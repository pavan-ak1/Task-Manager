const express = require('express');
const router =  express.Router();

//controller
const {getAllTasks,createTask,updateTask,deleteTask,getTask} = require('../controller/tasks')

router.route('/').get(getAllTasks).post(createTask)
router.route('/:id').get(getTask).patch(updateTask).delete(deleteTask)




module.exports = router;