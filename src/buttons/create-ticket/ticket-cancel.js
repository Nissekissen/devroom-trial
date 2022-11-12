const { ButtonBuilder, ButtonStyle } = require("discord.js");
const ticketClose = require("./ticket-close");
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    builder: new ButtonBuilder()
        .setLabel('Cancel')
        .setStyle(ButtonStyle.Danger)
        .setCustomId('ticket-cancel')
        .setEmoji('⛔'),
    async execute(interaction) {
        await ticketClose.execute(interaction)
    }
}