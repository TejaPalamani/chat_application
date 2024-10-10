import express from 'express';
import { validation } from '../validation/validation.js';
import {
  postingInConversation,
  getConversationById,
} from '../controller/ConversationController.js';

const ConversationRouter = express.Router();

ConversationRouter.use(validation);

ConversationRouter.post('/sendingMesg', postingInConversation);
ConversationRouter.get('/allConversations/:reciver_id', getConversationById); //here user how is sending is sender we have in cookies //user mwsg sending to is reciver

export default ConversationRouter;
