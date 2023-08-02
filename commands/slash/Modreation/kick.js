const {
  PermissionFlagsBits,
  ApplicationCommandOptionType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} = require("discord.js");
const ms = require("ms");

module.exports = {
  name: "kick",
  description: "kick member from the server",
  options: [
    {
      name: "user",
      description: "select a user you want to kick from server!",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "reason",
      description: "provide a reason",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],

  /**
   *
   * @param {import('../../../structures/lib/DiscordClient')} client
   * @param {import('discord.js').CommandInteraction} interaction
   *
   */

  run: async (client, interaction) => {
    await interaction.deferReply({ ephemeral: true, fetchReply: true });

    const { options, user, guild } = interaction;

    const member = options.getMember("user");
    const reason = options.getString("reason") || "NO REASON PROVIDED";

    const ErrEmbed = new EmbedBuilder()
      .setColor("#2F3136")
      .setTimestamp()
      .setFooter({
        text: `Made by ~ karan_xD`,
        iconURL: user.displayAvatarURL(),
      });

    if (!user.permissions.has(PermissionFlagsBits.KickMembers))
      return interaction.editReply({
        embeds: [
          ErrEmbed.setDescription(
            `<:cross_mark:1133343048827420772> You need to **KickMembers** permision to run this command`
          ).setAuthor({
            name: `KICK ERROR`,
            iconURL: user.displayAvatarURL(),
          }),
        ],
      });

    if (member.id === user.id)
      return interaction.editReply({
        embeds: [
          ErrEmbed.setDescription(
            `<:cross_mark:1133343048827420772> You can't kick Your self`
          ).setAuthor({
            name: `KICK ERROR`,
            iconURL: user.displayAvatarURL(),
          }),
        ],
      });

    if (guild.ownerId === member.id)
      return interaction.editReply({
        embeds: [
          ErrEmbed.setDescription(
            `<:cross_mark:1133343048827420772> You can't kick the server owner!`
          ).setAuthor({
            name: `KICK ERROR`,
            iconURL: user.displayAvatarURL(),
          }),
        ],
      });

    if (
      guild.members.me.roles.highest.position <= member.roles.highest.position
    )
      return interaction.editReply({
        embeds: [
          ErrEmbed.setDescription(
            `<:cross_mark:1133343048827420772> You can't kick member of your same level or higher!`
          ).setAuthor({
            name: `KICK ERROR`,
            iconURL: user.displayAvatarURL(),
          }),
        ],
      });
    if (
      interaction.member.roles.highest.position <= member.roles.highest.position
    )
      return interaction.editReply({
        embeds: [
          ErrEmbed.setDescription(
            `<:cross_mark:1133343048827420772> I can't kick member of your same level or higher!`
          ).setAuthor({
            name: `KICK ERROR`,
            iconURL: user.displayAvatarURL(),
          }),
        ],
      });

    const embed = new EmbedBuilder().setColor(client.color);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("kick-yes")
        .setStyle(ButtonStyle.Danger)
        .setLabel("yes"),

      new ButtonBuilder()
        .setCustomId("kick-no")
        .setStyle(ButtonStyle.Primary)
        .setLabel("no")
    );

    const page = await interaction.editReply({
      embeds: [
        embed.setDescription(
          `**<a:yellow_warning_animated:1122813038383353926>  Do You really want to kick this member!**`
        ),
      ],
      components: [row],
    });

    const col = await page.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: ms("15s"),
    });

    col.on("collect", (i) => {
      if (i.user.id !== user.id) return;

      switch (i.customId) {
        case "kick-yes":
          member.kick({ reason });

          interaction.editReply({
            embeds: [
              embed.setDescription(
                `**<:tick_mark:1133343219711758397> ${member} has been kicked successfully.**\n **Reason is: ${reason}**`
              ),
            ],
            components: [],
          });

          member
            .send({
              embeds: [
                new EmbedBuilder()
                  .setColor("#2F3136")
                  .setDescription(`You have been kicked from ${guild.name}`),
              ],
            })
            .catch((err) => {
              console.log(err.message);
            });

          break;

        case "kick-no":
          interaction.editReply({
            embeds: [
              embed.setDescription(
                `<:tick_mark:1133343219711758397> **kick request cancle now**`
              ),
            ],
            components: [],
          });
          break;
      }
    });

    col.on("end", (coll) => {
      if (coll.size > 0) return;

      interaction.editReply({
        embeds: [
          embed.setDescription(
            `**<:cross_mark:1133343048827420772> You didn't provide a valid resopnse in time**`
          ),
        ],
        components: [],
      });
    });
  },
};
