import mongoose from 'mongoose';
import { Messages } from '../model/messagesSchema.js';
import { Conversation } from '../model/conversationsSchema.js';
import { io, reciverSocetDetails } from '../socket/socketConection.js';

// functionality
//while we click on conversation we need all the previous conversation
//sending mesg will add the mesg and update in conversation

//while we click on conversation we need all the previous conversation
export const getConversationById = async (req, res) => {
  try {
    //we ll get reciver id in query param and sender id we have in a payload
    const { reciver_id } = req.params;
    const client_id = req.user_id;

    console.log('reciver_id', reciver_id);
    console.log('Clien_id', client_id);

    const ClientConversation = await Conversation.findOne({
      membersInConversation: { $all: [client_id, reciver_id] },
    }).populate({
      path: 'messages',
      populate: [
        { path: 'fromUser', select: ['profile', '_id'] },
        { path: 'toUser', select: ['profile', '_id'] },
      ],
    });

    if (!ClientConversation) {
      res.status(200).json({ data: [] });
    } else {
      res.status(200).json({ data: ClientConversation });
    }
  } catch (e) {
    console.log(e.message);
  }
};

//sending mesg will add the mesg and update in conversation
export const postingInConversation = async (req, res) => {
  try {
    const client_id = req.user_id;
    const { reciver, message } = req.body; //we dont need to send the from user

    const reciverSocket = reciverSocetDetails(reciver);
    const senderSocket = reciverSocetDetails(client_id);

    //first we need to add this in the mesg model later add it in conversation

    //before creating check we are reciving the mongo object are not
    const check = mongoose.isValidObjectId(reciver);
    if (!check) {
      res.status(400).json({ mesg: 'required valid it to enter' });
      return;
    }
    const addingToMessages = await Messages.create({
      fromUser: client_id,
      toUser: reciver,
      message,
    });

    const newMessages = await addingToMessages.populate([
      { path: 'fromUser', select: ['profile', '_id'] },
      { path: 'toUser', select: ['profile', '_id'] },
    ]);

    //after adding the mesg save the ref in conversation
    //checking conversation already present or not if yes we can skip creating and update the exixtig mesg array

    const checkingConversation = await Conversation.findOne({
      membersInConversation: { $all: [reciver, client_id] },
    });

    if (!checkingConversation) {
      const creatingConversation = await Conversation.create({
        membersInConversation: [client_id, reciver],
        messages: addingToMessages._id,
      });

      // await creatingConversation.populate({
      //   path: 'messages',
      //   populate: [
      //     { path: 'fromUser', select: ['profile', '_id'] },
      //     { path: 'toUser', select: ['profile', '_id'] },
      //   ],
      // });

      //socket io connection we need to send only mesg not the entire measga array

      io.to(reciverSocket).emit('newMessage', newMessages);
      io.to(senderSocket).emit('newMessage', newMessages);
    } else {
      //adding to exixting conversation
      const addingToExisting = await Conversation.findByIdAndUpdate(
        { _id: checkingConversation._id },
        { $push: { messages: addingToMessages._id } },
        { new: true }
      );
      // .populate({
      //   path: 'messages',
      //   populate: [
      //     { path: 'fromUser', select: ['profile', '_id'] },
      //     { path: 'toUser', select: ['profile', '_id'] },
      //   ],
      // });

      //socket io connection we need to send only mesg not the entire measga array

      io.to(reciverSocket).emit('newMessage', newMessages);
      io.to(senderSocket).emit('newMessage', newMessages);
    }

    res.status(200).json({ mesg: 'conversations added to database' });
  } catch (e) {
    console.log(e.message);
  }
};
