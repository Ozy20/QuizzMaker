const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const cors = require("cors")

const mongoose = require('mongoose');
require('dotenv').config();

const loginRouter = require('./routers/login');
const registerRouter = require('./routers/register');
const teacherRouter = require('./routers/teacher');
const studentRouter = require("./routers/student")

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err)
});
app.use(cors({
  origin: 'http://localhost:3000',
}));



app.use(express.json());
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/teacher', teacherRouter);
app.use('/student', studentRouter)

app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
});