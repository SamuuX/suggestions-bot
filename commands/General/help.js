const { RichEmbed } = require('discord.js');
const Command = require('../../base/Command');
const { noBotPerms } = require('../../utils/errors');

module.exports = class HelpCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'help',
            category: 'General',
            description: 'View bot commands and where to receive bot support.',
            aliases:  ['h', 'halp'],
        });
    }

    async run(message, args) {
        let config = this.client.config;
        let owner = config.owner;
        let embedColor = config.embedColor;
        let discord = config.discord;
        let docs = config.docs;
        let gSettings = await this.client.getSettings(message.guild);

        let {
            prefix,
            staffRoles,
            suggestionsChannel
        } = gSettings;

        suggestionsChannel = message.guild.channels.find(c => c.name === gSettings.suggestionsChannel) || message.guild.channels.find(c => c.toString() === gSettings.suggestionsChannel) || message.guild.channels.get(gSettings.suggestionsChannel);

        const roles = staffRoles.map(el => {
            return message.guild.roles.find(r => r.name === el.role || r.id === el.role);
        });

        let perms = message.guild.me.permissions;
        if (!perms.has('EMBED_LINKS')) return noBotPerms(message, 'EMBED_LINKS');

        let cmdName = this.help.name;

        let cmds = this.client.commands;
        let cmd = args[0];

        if (cmd) {

            let cmdObj = this.client.commands.get(cmd) || this.client.commands.get(this.client.aliases.get(cmd));
            if (!cmdObj) return;
            let cmdHelp = cmdObj.help;
            let cmdConf = cmdObj.conf;
    
            let cmdHelpEmbed = new RichEmbed()
                .setTitle(`${cmdHelp.name} | Help Information`)
                .setDescription(cmdHelp.description)
                .addField('Category', `\`${cmdHelp.category}\``, true)
                .setColor(embedColor);
            if (cmdHelp.usage !== null) cmdHelpEmbed.addField('Usage', `\`${cmdHelp.usage}\``, true);
            if (cmdConf.aliases.length) cmdHelpEmbed.addField('Aliases', `\`${cmdConf.aliases.join(', ')}\``, true);

            return message.channel.send(cmdHelpEmbed);
        }

        const userCmds = cmds.filter(cmd => cmd.conf.ownerOnly === false && cmd.conf.adminOnly === false).map(cmd => '`' + cmd.help.name + '`');
        const staffCmds = cmds.filter(cmd => cmd.conf.staffOnly === true).map(cmd => '`' + cmd.help.name + '`');
        const adminCmds = cmds.filter(cmd => cmd.conf.adminOnly === true).map(cmd => '`' + cmd.help.name + '`');
        const ownerCmds = cmds.filter(cmd => cmd.conf.ownerOnly === true).map(cmd => '`' + cmd.help.name + '`');

        const helpEmbed = new RichEmbed()
            .setTitle('Help Information')
            .setDescription(`View help information for ${this.client.user}. \n (Do \`${prefix + cmdName} <command>)\` for specific help information).`)
            .addField('Current Prefix', prefix)
            .addField('Suggestions Channel', suggestionsChannel.toString())
            .addField('User Commands', userCmds.join(' | '));
            if (message.member.hasPermission('MANAGE_GUILD') && message.member.roles.some(r => roles.includes(r))) helpEmbed.addField('Staff Commands', staffCmds.join(' | '));
            if (message.member.hasPermission('MANAGE_GUILD')) helpEmbed.addField('Admin Commands', adminCmds.join(' | '));
            if (message.author.id === owner) helpEmbed.addField('Owner Commands', ownerCmds.join(' | '));
            helpEmbed.addField('Command Cooldown', `A 5 second(s) is in place on bot commands except for users with the \`MANAGE_GUILD\` permission or users with a bot staff role.`)
            .addField('Documentation', docs)
            .addField('Found an issue?', `Please report any issues to <@${owner}> via the Support Discord: ${discord}.`)
            .setColor(embedColor);

        
        

        await message.channel.send(helpEmbed);

    }
};