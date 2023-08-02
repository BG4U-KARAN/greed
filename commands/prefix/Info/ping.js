const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "ping",
  description: "Show bot ping",
  /**
   *
   * @param {import('../../../structures/lib/DiscordClient')} client
   * @param {import('discord.js').Message} message
   * @param {Array<string>} args
   */
  run: (client, message, args) => {
      const embed = new EmbedBuilder()
      .setColor("#2F3136")
      .setTitle(`Bot ping`)
      .setThumbnail(client.user.avatarURL())
      .setFooter({text: `made by ~ karan_xD`, iconURL: client.user.displayAvatarURL()})

      const diff = `Latency is ${Date.now() - message.createdTimestamp} ms`;
      const ping = Math.round(client.ws.ping);
      embed.setDescription(
        `<a:bit:1082941658921979924>\`Bot ping is: ${diff}\`\n 
        <a:bit:1082941658921979924>\`Api ping is: ${ping} ms\``
      );
      message.reply({ embeds: [embed]});
  },
};
