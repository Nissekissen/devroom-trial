const { SelectMenuBuilder, EmbedBuilder } = require("discord.js");
const database = require('../../db/database')

module.exports = {
    builder: new SelectMenuBuilder()
        .setCustomId('ticket-category')
        .setPlaceholder('Select a category.')
        .addOptions([
            {
                label: 'Punishment Appeal',
                value: 'punishmentappeal'
            },
            {
                label: 'Report User',
                value: 'reportuser'
            },
            {
                label: 'Questions/Suggestions',
                value: 'questions'
            }
        ]),
    async execute(interaction) {
        const data = {}
        data.category = interaction.values[0];
        const embed = new EmbedBuilder()
    }
}