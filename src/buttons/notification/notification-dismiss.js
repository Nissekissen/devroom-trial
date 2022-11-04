const { ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    builder: new ButtonBuilder()
        .setCustomId('notification-dismiss')
        .setLabel('Dismiss')
        .setStyle(ButtonStyle.Danger),
    async execute(interaction) {
        await interaction.reply({ content: 'Notification dismissed!', ephemeral: true })
        await interaction.message.delete();
    }
}