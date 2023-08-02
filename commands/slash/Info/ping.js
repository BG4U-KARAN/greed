const { EmbedBuilder } = require('discord.js')

module.exports = {
    name: "ping",
    description: "bot ping",

     /**
     * 
     * @param {import('../../../structures/lib/DiscordClient')} client 
     * @param {import('discord.js').CommandInteraction} interaction
     * @param {import ('discord.js').Message } message
     * 
     */
    run: async (client, interaction) => {
     const {user} = interaction;

        const embed = new EmbedBuilder()
        .setColor("#2F3136")
        .setTitle('Bot Ping')
        .setFooter({text: `Requested by ${user.tag}`, iconURL: interaction.member.displayAvatarURL()})
        .setThumbnail(client.user.displayAvatarURL())
        .setTimestamp();

        const msg = await interaction.deferReply({
            // ephemeral: true,
            fetchReply: true,
        });

        const diff = msg.createdTimestamp - interaction.createdTimestamp;
        const ping = Math.round(client.ws.ping);

        embed.setDescription(`<a:bit:1082941658921979924> \`Bot ping is: ${diff}\` \n <a:bit:1082941658921979924>\`Api ping is: ${ping}\``)

        return interaction.editReply({embeds: [embed]});
    }
}