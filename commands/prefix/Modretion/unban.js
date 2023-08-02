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
  name: "unban", //command name
  description: "unban member from the server", // command description
  aliases: ["un", "ub"],
  permissions: {
    member: ["BanMembers"], // member permissions
    bot: ["SendMessages", "BanMembers"], // bot permissions
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

    if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return message.reply({
        embeds: [
          Embed.setDescription(
            `<:cross_mark:1133343048827420772> You need to **BanMembers** permision to run this command`
          ),
        ],
      });
    }

    const id = args[0];

    if (isNaN(id)) {
      return message.reply({
        embeds: [
          Embed.setDescription(
            `<:cross_mark:1133343048827420772> **please provide a valid id in numbers!**`
          ),
        ],
      });
    }

    const BanMembers = await guild.bans.fetch();

    if(!BanMembers.find((x) => x.user.id)) {
        return message.reply({
            embeds:[
                `<:cross_mark:1133343048827420772> ** The user was not banned yet!**`
            ]
        })
    }

    const embed = new EmbedBuilder().setColor("#2F3136");

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("unban-yes")
        .setStyle(ButtonStyle.Danger)
        .setLabel("yes"),

      new ButtonBuilder()
        .setCustomId("unban-no")
        .setStyle(ButtonStyle.Primary)
        .setLabel("no")
    );

    const page = await message.reply({
      embeds: [
        embed.setDescription(
          `**<a:yellow_warning_animated:1122813038383353926> Do You really want to unban this member!**`
        ),
      ],
      components: [row],
    });

    if (!page) {
      return message.reply({
        embeds: [
          embed.setDescription(
            `**<:cross_mark:1133343048827420772> I couldn't send you a Direct Message to confirm the unban. Please make sure your DMs are open.**`
          ),
        ],
        components: [],
      });
    }

    const col = await page.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: ms("15s"),
    });

    col.on("collect", async (i) => {
      if (i.user.id !== message.member.id) {
        return message.member.send({
          embeds: [
            embed.setDescription(`This interaction is only ${message.member}`),
          ],
        });
      }

      switch (i.customId) {
        case "unban-yes":
         
        await message.guild.members.unban(id);

          page.edit({
            embeds: [
              embed.setDescription(
                `**<:tick_mark:1133343219711758397> <@${id}> has been unbanned successfully.**`
              ),
            ],
            components: [],
          })
            .catch((er) => {
              console.log(er.message);
              return message.reply({
                embeds: [
                  embed.setDescription(
                    `**<:cross_mark:1133343048827420772> I couldn't send member a Direct Message to confirm the unban. Please make sure your DMs are open.**`
                  ),
                ],
                components: [],
              });
            });

          break;

        case "unban-no":
          page.edit({
            embeds: [
              embed.setDescription(
                `<:tick_mark:1133343219711758397> **unban request cancle now**`
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
