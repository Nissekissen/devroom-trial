const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const config = require('../../config.json')

const embed_data = require('../../config/embeds.json')

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
            .setTitle(embed_data.setup_command_embed.title)
            .setDescription(embed_data.setup_command_embed.content)
            .setColor(config.color)
        await interaction.reply({ embeds: [embed], ephemeral: true, components: [row] })
    }
}
