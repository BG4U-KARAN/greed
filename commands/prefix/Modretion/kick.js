const {
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} = require("discord.js");
const ms = require("ms");

module.exports = {
  name: "kick", //command name
  description: "kick member from the server", // command description
  aliases: ["k"],
  permissions: {
    member: ["KickMembers"], // member permissions
    bot: ["SendMessages", "KickMembers"], // bot permissions
  }, //command aliases
  /**
   *
   * @param {import('../../../structures/lib/DiscordClient')} client
   * @param {import('discord.js').Message} message
   * @param {Array<string>} args
   *
   */

  run: async (client, message, args) => {
    const Embed = new EmbedBuilder().setColor("#2F3136");

    const { user } = client;
    const { guild } = message;

    const member = message.mentions.members.first();
    const reason = args.slice(1).join(" ") || "No reason provided";

    if (!message.member.permissions.has(PermissionFlagsBits.KickMembers)) {
      return message.reply({
        embeds: [
          Embed.setDescription(
            `<:cross_mark:1133343048827420772> You need to **KickMembers** permision to run this command`
          ),
        ],
      });
    }

    if (!guild.members.cache.has(member)) {
      return message.reply({
        embeds: [
          Embed.setDescription(
            `<:cross_mark:1133343048827420772> Invalid or non-existent member mentioned.`
          ),
        ],
      });
    }

    if (member.id === user.id) {
      return message.reply({
        embeds: [
          Embed.setDescription(
            `<:cross_mark:1133343048827420772> You can't kick Your self`
          ),
        ],
      });
    }

    if (guild.ownerId === member.id) {
      return message.reply({
        embeds: [
          Embed.setDescription(
            `<:cross_mark:1133343048827420772> You can't kick the server owner!`
          ),
        ],
      });
    }

    if (
      guild.members.me.roles.highest.position <= member.roles.highest.position
    ) {
      return message.reply({
        embeds: [
          Embed.setDescription(
            `<:cross_mark:1133343048827420772> You can't kick member of your same level or higher!`
          ),
        ],
        ephemeral: true,
      });
    }

    if (
      message.member.roles.highest.position <= member.roles.highest.position
    ) {
      return message.reply({
        embeds: [
          Embed.setDescription(
            `<:cross_mark:1133343048827420772> I can't kick member of your same level or higher!`
          ),
        ],
      });
    }

    const embed = new EmbedBuilder().setColor("#2F3136");

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

    const page = await message.reply({
      embeds: [
        embed.setDescription(
          `**<a:yellow_warning_animated:1122813038383353926> Do You really want to kick this member!**`
        ),
      ],
      components: [row],
    });

    if (!page) {
      return message.reply({
        embeds: [
          embed.setDescription(
            `**<:cross_mark:1133343048827420772> I couldn't send you a Direct Message to confirm the kick. Please make sure your DMs are open.**`
          ),
        ],
        components: [],
      });
    }

    const col = await page.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: ms("15s"),
    });

    col.on("collect", (i) => {
      if (i.user.id !== message.member.id) {
        return message.member.send({
          embeds: [
            embed.setDescription(`This interaction is only ${message.member}`),
          ],
        });
      }

      switch (i.customId) {
        case "kick-yes":
          member.kick({ reason });

          page.edit({
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
                embed.setDescription(`You have been kicked from ${guild.name}`),
              ],
            })
            .catch((er) => {
              console.log(er.message);
              return message.reply({
                embeds: [
                  embed.setDescription(
                    `**<:cross_mark:1133343048827420772> I couldn't send member a Direct Message to confirm the kick. Please make sure your DMs are open.**`
                  ),
                ],
                components: [],
              });
            });

          break;

        case "kick-no":
          page.edit({
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

    col.on("end", (co) => {
      if (co.size > 0) return;

      page.edit({
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
