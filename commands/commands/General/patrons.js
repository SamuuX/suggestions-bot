const { RichEmbed } = require('discord.js-light');
const Command = require('../../Command');

module.exports = class PatronsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'patrons',
      category: 'General',
      description: 'View Patrons that support Nerd Cave Development.',
      botPermissions: ['EMBED_LINKS'],
      guildOnly: false,
      guarded: true,
      enabled: false
    });
  }

  async run(message, args) {

    const { embedColor, patreon } = this.client.config;
    const patreonEmoji = this.client.guilds.cache.get('345753533141876737').emojis.find(e => e.name === 'patreon');

    const patrons = [
      'Kyle',
      'Skelmis'
    ];

    const patronsEmbed = new RichEmbed()
      .setDescription(`
        These are Patrons that help support bot development of Nerd Cave Development! Thank 
        you to all who help support us in any form :nerd:
        
        ${patrons.map(p => `**• ${p}**`).join('\n')}

        ${patreonEmoji} [Become a Patron today!](${patreon})
        `)
      .setColor(embedColor)
      .setTimestamp();


    return message.channel.send(patronsEmbed);
  }
};
