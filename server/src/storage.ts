import mongoose from 'mongoose';
import config from 'config.json';

export let mongooseConnection: mongoose.Mongoose;

if (config.env === 'dev') {
  mongoose.set('debug', true);
}

mongoose.set('toJSON', {
  virtuals: true,
  transform: (doc, converted) => {
    delete converted._id;
  }
});

export async function initStorage() {
  mongooseConnection = await mongoose.connect(`${config.mongodb.uri}/${config.mongodb.dbName}`);
}
