const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const config = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Setup the ticket system')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),
    async execute(interaction) {
        const buttonData = require('../buttons/setup/setup-confirm')
        const row = new ActionRowBuilder()
            .addComponents(buttonData.builder)
        
        const embed = new EmbedBuilder()
            .setTitle('Ticket setup')
            .setDescription('Are you sure you want to setup the ticket system? This will create a **TICKETS category**, an **#open-ticket channel** and a **ticket-support** role.')
            .setColor(config.color)
        await interaction.reply({ embeds: [embed], ephemeral: true, components: [row] })
    }
}
