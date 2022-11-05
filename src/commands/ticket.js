const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder } = require("discord.js");

const embeds = require('../../config/embeds.json')
const config = require('../../config.json');
const ticketCreate = require("../buttons/create-ticket/ticket-create");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Create a new Ticket')
        .setDMPermission(false),
    async execute(interaction) {
        const data = embeds.ticket_create_embed
        const embed = new EmbedBuilder()
            .setTitle(data.title)
            .setDescription(data.content)
            .setColor(config.color)
        
        const row = new ActionRowBuilder()
            .addComponents(ticketCreate.builder)
        
        await interaction.reply({ embeds: [embed], components: [row], ephemeral: true })
    }
}