const connectDB = require('./db/connect')
const express =  require('express')
const app = express()
const tasks = require('./routes/tasks')
require('dotenv').config()



//middeware
app.use(express.static('./public'))
app.use(express.json())


//routes


app.use('/api/v1/tasks',tasks);

//General rest apis used in this project 
//get- api/tasks - get all tasks
//post - api/tasks-create tasks
//get-api/tasks/:id-get task
//put/patch - api/tasks/:id - update task
//delete - api/tasks/:id - delete task



const port = 3000;

const start = async ()=>{
    try{
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log(`Serve is listening at  port ${port}`))
        console.log('Connected to DB');
        
    }
    catch(error){
        console.log(error);
        
    }
}

start()




