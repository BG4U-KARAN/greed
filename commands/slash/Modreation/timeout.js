const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const ms = require("ms");

module.exports = {
  name: "timeout",
  description: "timeout member",
  options: [
    {
      name: "user",
      description: "select user you want to give timeout.",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "duration",
      description: "Timeout duration (30m, 1h, 1day)",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "reason",
      description: "give a reason",
      type: ApplicationCommandOptionType.String,
    },
  ],

  /**
   *
   * @param {import('../../../structures/lib/DiscordClient')} client
   * @param {import('discord.js').CommandInteraction} interaction
   *
   */

  run: async (client, interaction) => {
    const { options, deferReply, guild } = interaction;

    const embed = new EmbedBuilder().setColor(client.color)
    .setAuthor({
      name: `Timeout Member!`,
      iconURL: interaction.user.displayAvatarURL()
    })
    .setFooter({text: `Requested by ${interaction.user.tag}`, iconURL: interaction.member.displayAvatarURL()})
    .setThumbnail(interaction.guild.iconURL())

    const mentionable = options.get("user").value;
    const duration = options.get("duration").value;
    const reason = options.get("reason")?.value || "No reason provided";

    await interaction.deferReply();

    const targetUser = await guild.members.fetch(mentionable);

    if (!targetUser) {
      await interaction.editReply({
        embeds: [
          embed.setDescription(
            `<:cross_mark:1133343048827420772> The user was dosen't exits in this server!`
          ),
        ],
      });
      return;
    }

    if (targetUser.user.bot) {
      await interaction.editReply({
        embeds: [
          embed.setDescription(
            `<:cross_mark:1133343048827420772> I can't mute a bot.`
          ),
        ],
      });

      return;
    }

    const msDuration = ms(duration);

    if (isNaN(msDuration)) {
      await interaction.editReply({
        embeds: [
          embed.setDescription(
            `<:cross_mark:1133343048827420772> please provide a valid timeout duration.`
          ),
        ],
      });
      return;
    }

    if (msDuration < 5000 || msDuration > 2.419e9) {
      await interaction.editReply({
        embeds: [
          embed.setDescription(
            `<:cross_mark:1133343048827420772> Timeout duration cannot be less than 5 seconds or more than 28 days`
          ),
        ],
      });
      return;
    }

    const targetPostion = targetUser.roles.highest.position;
    const reqPostion = interaction.member.roles.highest.position;
    const botPostion = interaction.guild.members.me.roles.highest.position;

    if (targetPostion >= reqPostion) {
      await interaction.editReply({
        embeds: [
          embed.setDescription(
            `<:cross_mark:1133343048827420772> You can't timout that user becuase they have the same/higher role than you.`
          ),
        ],
      });
      return;
    }

    if (targetPostion >= botPostion) {
      await interaction.editReply({
        embeds: [
          embed.setDescription(
            `<:cross_mark:1133343048827420772> I can't timeout that user becuase they have the same/higher role than me.`
          ),
        ],
      });
      return;
    }

    try {
      const { default: prettyMs } = await import("pretty-ms");

      if(targetUser.isCommunicationDisabled()) {
        await targetUser.timeout(msDuration, reason);

        await interaction.editReply({
            embeds:[
                embed.setDescription(`${targetUser}'s timeout has been updated to ${prettyMs(msDuration, {verbose: true})}. \n Reason: ${reason}`)
            ]
        });
        return;
      }

      await targetUser.timeout(msDuration, reason);

      await interaction.editReply({
        embeds:[
            embed.setDescription(`${targetUser} was timed out for ${prettyMs(msDuration, {verbose: true})}. \n Reason: ${reason}`)
        ]
      })
    } catch (error) {
      console.log(`There was an error when timing out: ${error.message}`);
    }
  },
};
