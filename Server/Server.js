const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv/config');
const cookieParser = require('cookie-parser');
const connectDB = require('./Config/MongoDB');
const authRouter = require('./Routes/AuthRouter');
const userRouter = require('./Routes/UserRoutes');

const app = express();
const port = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, 'dist'))); // or 'build' if CRA

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
connectDB();

const allowedOrigins = ['http://localhost:5173'];

app.use(cors({origin:allowedOrigins, credentials: true}));
app.use(express.json());
app.use(cookieParser());


app.get('/', (req, res) => {
    res.send('Hello Bitchs!');
});
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
