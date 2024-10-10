import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import express, { json, Router } from 'express';
import cors from 'cors';
import { mongoConnection } from './dbConnection/Connection.js';
import UserRouter from './routes/UserRoute.js';
import ConversationRouter from './routes/ConversationRoute.js';
import { validation } from './validation/validation.js';
import { httpServer, app } from './socket/socketConection.js';

app.use(express.json());

dotenv.config();

//mongodb connection

const port = process.env.port;

app.use('/user', UserRouter);

app.use('/user/conversation', ConversationRouter);

app.get('/', (req, res) => {
  res.status(200).send('server health v1');
});

httpServer.listen(port, () => {
  console.log(`app is listening to ${port}`);
  mongoConnection();
});
