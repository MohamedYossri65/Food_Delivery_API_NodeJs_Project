import express from 'express';
import * as authcontroller from './auth.controller.js';
import validation from '../middleware/validation.js';
import * as authValidation from './auth.validation.js';
import { forgotPasswordLimiter, loginLimiter } from '../middleware/rateLimit.js';
import { uploadSingleFile } from '../middleware/fileUpload.js';

const authRouter = express.Router();


authRouter.post('/signup', uploadSingleFile('users', 'image'), authcontroller.signUp);
authRouter.post('/signup-restaurant', uploadSingleFile('users', 'image'), authcontroller.signUp);


authRouter.post('/signin', loginLimiter, authcontroller.signIn);

authRouter.post('/forgetpassword', forgotPasswordLimiter, authcontroller.forgetPsssword);

authRouter.patch('/resetpassword/:token', authcontroller.resetPsssword);

authRouter.patch('/updatepassword', authcontroller.protectedRouts, authcontroller.updatePassword);

authRouter.patch('/updateme', authcontroller.protectedRouts, uploadSingleFile('users', 'image') , validation(authValidation.updateMeSchema), authcontroller.updateMe);

authRouter.post('/deleteme', authcontroller.protectedRouts, authcontroller.deleteMe);





export default authRouter;
