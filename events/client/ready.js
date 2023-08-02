const {
  ActivityType,
  PresenceUpdateStatus,
  Presence,
  PresenceManager,
} = require("discord.js");
const mongoose = require("mongoose");
const config = require("../../config")

module.exports = {
  name: "ready",
  /**
   *
   * @param {import('../../structures/lib/DiscordClient')} client
   */
  run: async (client) => {

    console.log(`${client.user.tag} is now online!`);
    client.guilds.cache.forEach((guild) => {
      guild.commands.set([]);
      client.slashCommands.forEach((cmd) => {
        guild.commands
          .create(cmd)
          // .then(() =>
          //   console.log(
          //     `"${cmd.name}" Slash command loaded. Guild: ${guild.id}`
          //   )
          // );
      });
      client.contextCommands.forEach((cmd) => {
        guild.commands
          .create(cmd)
          // .then(() =>
          //   console.log(
          //     `"${cmd.name}" Context command loaded. Guild: ${guild.id}`
          //   )
          // );
      });
    });

    try {
      mongoose.set('strictQuery', false)
      await mongoose.connect(config.MONGO || '', {
        keepAlive: true,
      });

      if(mongoose.connect) {
        console.log(`[SERVER] database connected successfully`)
      }
    } catch (error) {
      console.log(error.message)
    }

    const activities = [
      {
        name: "? help",
        type: ActivityType.Playing,
      },
      {
        name: "/help",
        type: ActivityType.Watching,
      },
      {
        name: `${client.guilds.cache.size} servers!`,
        type: ActivityType.Competing,
      },
      {
        name: `karan op`,
        type: ActivityType.Listening
      }
    ];

    const updateDelay = 5; // in seconds
    let currentIndex = 0;

    setInterval(() => {
      const activity = activities[currentIndex];
      client.user.setActivity(activity);

      // update currentIndex
      // if it's the last one, get back to 0
      currentIndex =
        currentIndex >= activities.length - 1 ? 0 : currentIndex + 1;

    }, updateDelay * 1000);

    client.user.setStatus("idle");
  },
};
