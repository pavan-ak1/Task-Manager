const express = require('express')
const app = express()
const tasks = require('./routes/tasks')
const connectDB = require('./db/connect')
const cookieParser = require('cookie-parser')
require('dotenv').config()

const authController = require('./routes/authRoutes')

// Redirect '/' to login BEFORE serving static files
app.get('/', (req, res) => {
  res.redirect('/login.html')
})

// middleware
app.use(express.static('./public'))
app.use(express.json())
app.use(cookieParser())

// task routes
app.use('/api/v1/auth', authController)
app.use('/api/v1/tasks', tasks)

const port = process.env.PORT || 3000
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () => console.log(`Server is listening at port ${port}`))
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

start()
