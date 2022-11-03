const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('First test'),
    async execute(interaction) {
        await interaction.reply({ content: 'Test!' })
    }
}