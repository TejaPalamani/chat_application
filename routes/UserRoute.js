import express from 'express';
import {
  getAllUsers,
  userSignIn,
  userSignup,
} from '../controller/UserController.js';
import { validation } from '../validation/validation.js';

const UserRouter = express.Router();

// Define your routes
UserRouter.post('/signup', userSignup);
UserRouter.post('/signin', userSignIn); // Assuming you have a sign-in function as well
UserRouter.get('/allUserDetails', validation, getAllUsers);

export default UserRouter;
