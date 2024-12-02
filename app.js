const express =  require('express')
const app = express()
const tasks = require('./routes/tasks')


//middeware

app.use(express.json())


//routes
app.get('/hello',(req,res)=>{
    res.send("Task Manager app")
})

app.use('/api/v1/tasks',tasks);

//General rest apis used in this project 
//get- api/tasks - get all tasks
//post - api/tasks-create tasks
//get-api/tasks/:id-get task
//put/patch - api/tasks/:id - update task
//delete - api/tasks/:id - delete task



const port = 3000;

app.listen(port, console.log(`Serve is listening at  port ${port}`))