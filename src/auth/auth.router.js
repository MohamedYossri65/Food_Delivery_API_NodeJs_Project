import express from 'express';
import * as authcontroller from './auth.controller.js';
import validation from '../middleware/validation.js';
import * as authValidation from './auth.validation.js';

const authRouter = express.Router();


authRouter.post('/signup', authcontroller.signUp);
authRouter.post('/signup-restaurant', authcontroller.signUp); 

authRouter.post('/signin', authcontroller.signIn);

authRouter.post('/forgetpassword', authcontroller.forgetPsssword);

authRouter.patch('/resetpassword/:token', authcontroller.resetPsssword);

authRouter.patch('/updatepassword', authcontroller.protectedRouts, authcontroller.updatePassword);

authRouter.patch('/updateme', authcontroller.protectedRouts , validation(authValidation.updateMeSchema), authcontroller.updateMe);

authRouter.post('/deleteme', authcontroller.protectedRouts, authcontroller.deleteMe);





export default authRouter;
