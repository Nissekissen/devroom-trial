const { ButtonBuilder, ButtonStyle } = require("discord.js");

const database = require('../../db/database')
const wait = require('node:timers/promises').setTimeout;

const ticket_cancel = require('./ticket-cancel')

module.exports = {
    builder: new ButtonBuilder()
        .setLabel('Close Ticket')
        .setStyle(ButtonStyle.Danger)
        .setCustomId('ticket-cancel')
        .setEmoji('⛔'),
    async execute(interaction) {
        database.findOne('ticket', 'tickets', { channelId: interaction.channel.id }, async (result) => {
            await interaction.reply("Deleting ticket...")
            await wait(2000);
            await interaction.channel.delete();
            database.delete('ticket', 'tickets', { channelId: result.channelId });
        })
    }
}