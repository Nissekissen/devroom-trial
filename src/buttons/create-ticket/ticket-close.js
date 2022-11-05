const { ButtonBuilder, ButtonStyle } = require("discord.js");

const database = require('../../db/database')
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    builder: new ButtonBuilder()
        .setLabel('Close Ticket')
        .setStyle(ButtonStyle.Danger)
        .setCustomId('ticket-cancel')
        .setEmoji('⛔'),
    async execute(interaction) {
        database.findOne('ticket', 'tickets', { channelId: interaction.channelId }, async (result) => {
            await interaction.reply("Deleting ticket...")
            await wait(2000);
            await interaction.channel.delete();
            try {
                database.delete('ticket', 'tickets', { channelId: interaction.channelId });
            } catch (error) {
                console.error(error);
            }
        })
    }
}