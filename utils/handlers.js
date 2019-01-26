const { promisify } = require('util');
const readdir = promisify(require('fs').readdir);
const path = require('path');
const klaw = require('klaw');

class CommandHandler {
    constructor(client) {
        this.client = client;
    }

    /* 
    COMMAND LOAD AND UNLOAD
  
    To simplify the loading and unloading of commands from multiple locations
    including the index.js load loop, and the reload function, these 2 ensure
    that unloading happens in a consistent manner across the board.
    */

    loadCommand(cmdPath, cmdName) {
        try {
            const props = new (require(`${cmdPath}${path.sep}${cmdName}`))(this.client);
            this.client.logger.log(`Loading Command: ${props.help.name}. 👌`, 'log');
            props.conf.location = cmdPath;
            if (props.init) props.init(this.client);
            this.client.commands.set(props.help.name, props);
            props.conf.aliases.forEach(alias => {
                this.client.aliases.set(alias, props.help.name);
            });
            return;
        } catch (e) {
            `Unable to load command ${cmdName}: ${e}`;   
        }
    }

    async unloadCommand(cmdPath, cmdName) {
        let command;
        if (this.client.commands.has(cmdName)) command = this.client.commands.get(cmdName);
        else command = this.client.commands.get(this.client.aliases.get(cmdName));

        if (!command) return `The command \`${cmdName}\` doesn't seem to exist, nor is it an alias. Try again!`;

        if (command.shutdown) await command.shutdown(this);

        delete require.cache[require.resolve(`${cmdPath}${path.sep}${cmdName}.js`)];
        return;
    }


    init() {
        klaw('./commands/commands').on('data', (item) => {
            const cmdFile = path.parse(item.path);
            if (!cmdFile.ext || cmdFile.ext !== '.js') return;
            const response = this.loadCommand(cmdFile.dir, `${cmdFile.name}${cmdFile.ext}`);
            if (response) this.client.logger.error(response);
        });
        return;
    }
}

class EventHandler {
    constructor(client) {
        this.client = client;
    }

    async init() {
        const evtFiles = await readdir('./events/');
        this.client.logger.log(`Loading a total of ${evtFiles.length} events.`, 'log');
        evtFiles.forEach(file => {
            const evtName = file.split('.')[0];
            this.client.logger.log(`Loading Event: ${evtName}. 👌`);
            const event = new(require(`../events/${file}`))(this.client);
            this.client.on(evtName, (...args) => event.run(...args));
            delete require.cache[require.resolve(`../events/${file}`)];
        });
        return;
    }
}

module.exports = {
    CommandHandler,
    EventHandler
};