const { RichEmbed } = require('discord.js');
const permissions = require('./perms');

class ErrorHandler {
    constructor(client) {
        this.client = client;
        this.colors = { red: '#FF4500' };
    }

    async gRoles(message, settings) {
        const roles = settings.staffRoles;
    
        let staffRoles = [];
        roles.forEach(role => {
            let gRole = message.guild.roles.find(r => r.id === role.role);
            if (!gRole) return;
    
            return staffRoles.push(gRole);
        });
    
        staffRoles.sort((a, b) => b.position - a.position);
    
        return staffRoles[staffRoles.length-1].toString();
    }
    
    noPerms(message, perm) {
    
        const embed = new RichEmbed()
            .setTitle('Error')
            .setDescription(message.author + ', you lack certain permissions to do this action.')
            .setColor(this.colors.red)
            .addField('Permission', `\`${permissions[perm]} (${perm})\``);
    
        message.channel.send(embed).then(m => m.delete(5000)).catch(err => this.client.logger.error(err));
    }
    
    noSuggestionsPerms(message, roles) {  
        const sorted = roles
            .sort((a, b) => a.position - b.position);

        const embed = new RichEmbed()
            .setTitle('Error')
            .setDescription(`You lack certain staff roles to do this action.`)
            .setColor(this.colors.red)
            .addField('Lowest Required Role', sorted[0].toString());
    
        message.channel.send(embed).then(m => m.delete(5000)).catch(err => this.client.logger.error(err));
    }
    
    noChannelPerms(message, channel, perm) {
        message.channel.send(`I am missing a permission in the ${channel} channel! Make sure I have \`${permissions[perm]} (${perm})\`.`).then(msg => msg.delete(5000));
    }
    
    noSuggestions(channel) {
    
        const embed = new RichEmbed()
            .setTitle('Error')
            .setDescription('A suggestions channel does not exist! Please create one or contact a server administrator.')
            .setColor(this.colors.red);
            
        channel.send(embed).then(m => m.delete(5000)).catch(err => this.client.logger.error(err));
    }
    
    noStaffSuggestions(channel) {
    
        const embed = new RichEmbed()
            .setTitle('Error')
            .setDescription('A staff suggestions channel does not exist! Please create one or contact a server administrator.')
            .setColor(this.colors.red);
            
        channel.send(embed).then(m => m.delete(5000)).catch(err => this.client.logger.error(err));
    }
    
    noSuggestionsLogs(channel) {
    
        const embed = new RichEmbed()
            .setTitle('Error')
            .setDescription('A suggestions logs channel does not exist! Please create one or contact a server administrator.')
            .setColor(this.colors.red);
            
        channel.send(embed).then(m => m.delete(5000)).catch(err => this.client.logger.error(err));
    }

    noUsage(channel, cmd, settings) {

        const { embedColor } = this.client.config;
        
        const embed = new RichEmbed()
            .setTitle(`${cmd.help.name} | Help Information`)
            .setDescription(cmd.help.description)
            .addField('Category', `\`${cmd.help.category}\``, true)
            .addField('Usage', `\`${settings.prefix + cmd.help.usage}\``, true)
            .setColor(embedColor)
            .setFooter('<> = Required | [] = Optional')
            .setTimestamp();
            
        if (cmd.conf.aliases.length) embed.addField('Aliases', `\`${cmd.conf.aliases.join(', ')}\``, true);

        return channel.send(embed)
            .then(m => m.delete(7500))
            .catch(e => this.client.logger.error(e.stack));
    }

    noSuggestion(channel, sid) {
        return channel.send(`Could not find the suggestion with the sID **${sid}** in the database.`)
            .then(m => m.delete(5000))
            .catch(e => this.client.logger.error(e));
    }

}

module.exports = ErrorHandler;