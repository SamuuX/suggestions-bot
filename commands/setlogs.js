const Settings = require('../models/settings');
const { noPerms, maintenanceMode } = require('../utils/errors');
const { owner } = require('../config');

exports.run = async (client, message, args) => {

    let status = cmdStatus.get('status');
    if (status === 'off' && message.author.id !== owner)  return maintenanceMode(message.channel);

    let perms = message.guild.me.permissions;
    if (!perms.has('MANAGE_MESSAGES')) return message.channel.send('I can\'t delete messages! Make sure I have this permission: Manage Messages`').then(msg => msg.delete(5000));

    await message.delete().catch(O_o => {});

    let gSettings = await Settings.findOne({ guildID: message.guild.id }).catch(err => {
        console.log(err);
        return message.channel.send(`Error querying the database for this guild's information: **${err.message}**.`);
    });

    const cmdName = client.commands.get('setlogs', 'help.name');

    let admins = [];
    message.guild.members.forEach(collected => { if (collected.hasPermission('MANAGE_GUILD') && !collected.user.bot) return admins.push(collected.id); });

    if (!admins.includes(message.member.id)) return noPerms(message, 'MANAGE_GUILD');

    const value = args[0];
    if (!value) return message.channel.send(`Usage: \`${gSettings.prefix + cmdName} <name>\``).then(m => m.delete(5000)).catch(err => console.log(err));

    await Settings.findOneAndUpdate(
        { guildID: message.guild.id },
        { suggestionsLogs: value }, 
    ).catch(err => {
        console.log(err);
        message.channel.send(`Error setting the logs channel: **${err.message}**.`);
    });

    await message.channel.send(`Suggestions logs channel has been changed to: ${value}`);
};

exports.help = {
    name: 'setlogs',
    aliases: [],
    description: 'Set a logs channel for suggestion results',
    usage: 'setlogs <name>'
};