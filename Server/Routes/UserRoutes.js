const express = require('express');
const userRouter = express.Router();


const {getUserProfile } = require('../Controllers/UserController');
const userAuth = require('../Middleware/UserAUTH');

userRouter.get('/profile',userAuth,  getUserProfile);

module.exports = userRouter;