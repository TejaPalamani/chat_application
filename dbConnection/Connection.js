import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

export const mongoConnection = async () => {
  try {
    const mongoCon = await mongoose.connect(process.env.mongo_url);
    console.log(
      `mongoDb connected .. conncted to host${mongoCon.connection.host} database ${mongoCon.connection.name}`
    );
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};
