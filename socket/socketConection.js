import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();

app.use(cors());

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow all methods
    credentials: true, // Allow credentials if needed
  },
});

export const reciverSocetDetails = (reciverSocketId) => {
  return activeUsers[reciverSocketId];
};

//for ACTIVE USERS
export const activeUsers = {};
io.on('connection', (userSocket) => {
  const userID = userSocket.handshake.query.userID;

  activeUsers[userID] = userSocket.id; // creating a dict for active users

  console.log(`user connected ${userSocket.id}`);

  //we needed array of active users not
  const activeUserArray = Object.keys(activeUsers);

  io.emit('activeUserDetails', activeUserArray);

  userSocket.on('disconnect', () => {
    console.log(
      `User disconnected: ${userID} with socket ID: ${userSocket.id}`
    );
    delete activeUsers[userID]; // Remove user from active users
    const activeUserArray = Object.keys(activeUsers);
    io.emit('activeUserDetails', activeUserArray); // Update active user list
  });
});

export { httpServer, app, io };
