const mongoose = require('mongoose');

const MongoHelpers = require('./helpers');
const Logger = require('../../utils/logger');

module.exports = class MongoDB {
  constructor(client) {
    this.client = client;
    this.connection = false;
    this.helpers = new MongoHelpers(this);
  }

  async init() {
    await mongoose.connect(process.env.MONGO_URI, {
      autoIndex: false,
      connectTimeoutMS: 10000,
      family: 4
    }, err => {
      if (err) Logger.error('MONGODB ERROR', err);
      return true;
    });

    this.connection = mongoose.connection;
  }
};
