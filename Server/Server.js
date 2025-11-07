const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv/config');
const cookieParser = require('cookie-parser');
const connectDB = require('./Config/MongoDB');
const authRouter = require('./Routes/AuthRouter');
const userRouter = require('./Routes/UserRoutes');
const path = require('path');


const app = express();
const port = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, 'client/dist')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
});

connectDB();

const allowedOrigins = ['http://localhost:5173', 'https://mern-auth-frontend-un9e.onrender.com'];

app.use(cors({origin:allowedOrigins, credentials: true}));
app.use(express.json());
app.use(cookieParser());



app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
