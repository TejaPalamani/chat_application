import mongoose from 'mongoose';

//it is esay to run mongo commands but as the application grows it becomes complicated
// const originalPlane = new mongoose.Schema({
//   fromUser: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//   },
//   ToUser: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//   },
//   messagesArray: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Messages',
//     },
//   ],
// });

//my second approch
//we can identify the records by matching the exact array of members
//it is flexible for group chat too

const conversationSchema = new mongoose.Schema({
  membersInConversation: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],

  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Messages' }],
});

export const Conversation = mongoose.model('Conversation', conversationSchema);
