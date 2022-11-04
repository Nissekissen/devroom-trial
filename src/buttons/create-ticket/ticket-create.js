const { SelectMenuBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    builder: new ButtonBuilder()
        .setLabel('Create Ticket')
        .setEmoji('📝')
        .setStyle(ButtonStyle.Primary)
        .setCustomId(`ticket-create`),
    async execute(interaction) {
        await interaction.reply('test');
    }
}