const { ButtonBuilder, ButtonStyle } = require("discord.js");
const Ticket = require("../../db/models/Ticket");
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    builder: new ButtonBuilder()
        .setLabel('Close Ticket')
        .setStyle(ButtonStyle.Danger)
        .setCustomId('ticket-cancel')
        .setEmoji('⛔'),
    async execute(interaction) {
        await interaction.reply("Deleting ticket...")
        await wait(2000);
        await Ticket.findOneAndDelete({ channelId: interaction.channelId })
        await interaction.channel.delete();
    }
}