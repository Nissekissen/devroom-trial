const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

const embeds = require('../../config/embeds.json');
const config = require('../../config.json')
const database = require("../db/database");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cleartickets')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDescription('Clear all tickets. This is irreversable.')
        .setDMPermission(false),
    async execute(interaction) {
        const embedData = embeds.cleartickets_embed
        database.find('ticket', 'tickets', {}, async (result) => {
            for (const data of result) {
                await interaction.guild.channels.delete(data.channelId, 'Cleared Tickets')
            }
            await database.deleteMany('ticket', 'tickets', {})

            const embed = new EmbedBuilder()
                .setTitle(embedData.title)
                .setDescription(embedData.content)
                .setColor(config.color)
            
            await interaction.reply({ embeds: [embed], ephemeral: true })
        })
    }
}