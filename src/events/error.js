const util = require('util');

const Event = require('../structures/Event');
const Logger = require('../utils/logger');

module.exports = class extends Event {
  constructor(client, name) {
    super(client, name);
  }

  async run(error) {
    Logger.log(`An error event was sent by Discord.js: \n${util.inspect(error)}`, 'error');
  }
};
