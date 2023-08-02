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
    name: "unban",
    description: "unban member from the server",
    options: [
      {
        name: "user-id",
        description: "select a user you want to ban from server!",
        type: ApplicationCommandOptionType.String,
        required: true,
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
  
      const { options, user, guild, member } = interaction;
  
      const id = options.getString("user-id");
  
      const ErrEmbed = new EmbedBuilder()
        .setColor("#2F3136")
        .setTimestamp()
        .setFooter({
          text: `Made by ~ karan_xD`,
          iconURL: user.displayAvatarURL(),
        });
  

        if(isNaN(id)) return interaction.editReply({
            embeds: [
                ErrEmbed.setDescription(`<:cross_mark:1133343048827420772> **please provide a valid id in numbers!**`)
                .setAuthor({
                    name: `UNBAN ERROR`,
                    iconURL: user.displayAvatarURL()
                })
            ]
        })

        const BanMembers = await guild.bans.fetch()
        if(!BanMembers.find(x => x.user.id)) return interaction.editReply({
            embeds: [
                ErrEmbed.setDescription(`<:cross_mark:1133343048827420772> ** The user was not banned yet!**`)
            ]
        })
  
      const embed = new EmbedBuilder().setColor(client.color);
  
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
  
      const page = await interaction.editReply({
        embeds: [
          embed.setDescription(
            `**<a:yellow_warning_animated:1122813038383353926>  Do You really want to unban this member!**`
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
          case "unban-yes":
            
          guild.members.unban()
  
            interaction.editReply({
              embeds: [
                embed.setDescription(
                  `**<:tick_mark:1133343219711758397> ${id} has been unban successfully.**`
                ),
              ],
              components: [],
            })
              .catch((err) => {
                console.log(err.message);
              });
  
            break;
  
          case "ban-no":
            interaction.editReply({
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
  