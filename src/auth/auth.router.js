import express from 'express';
import * as authcontroller from './auth.controller.js';

const authRouter = express.Router();


authRouter.route('/signup')
    .post(authcontroller.signUp)
authRouter.route('/signin')
    .post(authcontroller.signIn)



export default authRouter;
