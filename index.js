const { EmbedBuilder } = require('discord.js');
const DiscordClient = require('./structures/lib/DiscordClient');
const client = new DiscordClient();

client.color = '#2F3136';
client.start();

module.exports = client;