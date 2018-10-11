const Discord = require('discord.js');
const Settings = require('../models/settings.js');
const { owner, embedColor, discord, docs } = require('../config.js');
const cmdSeconds = '5';

exports.run = async (client, message, args) => {

    let perms = message.guild.me.permissions;
    if (!perms.has('MANAGE_MESSAGES')) return message.channel.send('I can\'t delete messages! Make sure I have this permission: Manage Messages`').then(msg => msg.delete(5000));
    if (!perms.has('EMBED_LINKS')) return message.channel.send('I can\'t embed links! Make sure I have this permission: `Embed Links`').then(msg => msg.delete(5000));

    let cmds = Array.from(client.commands.keys());
    let newCmds = [];

    for (let i = 0; i < cmds.length; i++) {
        if (cmds[i] === 'maintenance') continue;
        if (cmds[i] === 'beta') continue;
        if (cmds[i] === 'eval') continue;
        if (cmds[i] === 'blacklist') continue;
        if (cmds[i] === 'lockchannel') continue;

        newCmds.push(cmds[i]);
    }

    const helpCmds = newCmds.map(el => {
        return '`' + el + '`';
    });

    let gSettings = await Settings.findOne({ guildID: message.guild.id }).catch(err => {
        console.log(err);
        return message.channel.send(`Error querying the database for this guild's information: **${err.message}**.`);
    });

    let channel = gSettings.suggestionsChannel;
    let prefix = gSettings.prefix;

    const suggestionsChannel = message.guild.channels.find(c => c.name === channel) || message.guild.channels.find(c => c.toString() === channel) || 'None';

    const helpEmbed = new Discord.RichEmbed()
        .setTitle('Help Information')
        .setDescription(`View help information for ${client.user}.`)
        .addField('Current Prefix', prefix)
        .addField('Suggestions Channel', suggestionsChannel)
        .addField('Bot Commands', helpCmds.join(' | '))
        .addField('Command Cooldown', `A ${cmdSeconds} second(s) cooldown is in place on bot commands except for users with the \`MANAGE_GUILD\` permission or users with a bot staff role.`)
        .addField('Documentation', docs)
        .addField('Found an issue?', `Please report any issues to <@${owner}> via the Support Discord: ${discord}.`, false)
        .setColor(embedColor);

    let status = cmdStatus.get('status');
    if (status === 'off') await helpEmbed.addField('Maintenance', 'The bot is currently in maintenance . If you have further questions, please join the Support Discord. Otherwise, the maintenance period should not be that long.');

    await message.channel.send(helpEmbed);
};

exports.help = {
    name: 'help',
    aliases: ['h', 'halp'],
    description: 'View all commands and where to receive bot support.',
    usage: 'help'
};