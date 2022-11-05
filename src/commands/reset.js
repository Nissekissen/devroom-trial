const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

const embeds = require('../../config/embeds.json');
const config = require('../../config.json')
const database = require("../db/database");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reset')
        .setDescription('Reset the bot completely.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),
    async execute(interaction) {
        const embedData = embeds.reset_embed;
        database.findOne('ticket', 'channel', { name: 'support-role' }, async (role) => {
            database.findOne('ticket', 'channel', { name: 'ticket-category' }, async (categoryData) => {
                const category = interaction.guild.channels.cache.get(categoryData.id)
                category.children.cache.forEach(async channel => await channel.delete())
                await category.delete();
            })
            const embed = new EmbedBuilder()
                .setTitle(embedData.title)
                .setDescription(embedData.content)
                .setColor(config.color)
            
            await database.dropDatabase('ticket')
            await interaction.reply({ embeds: [embed], ephemeral: true })
        })
    }
}