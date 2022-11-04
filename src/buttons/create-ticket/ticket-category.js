const { SelectMenuBuilder, EmbedBuilder, ActionRowBuilder } = require("discord.js");
const database = require('../../db/database')
const config = require('../../../config.json')

const ticket_close = require('./ticket-close')
const categories = require('../../../config/categories.json')

module.exports = {
    builder: new SelectMenuBuilder()
        .setCustomId('ticket-category')
        .setPlaceholder('Select a category.')
        .addOptions(categories.options),
    async execute(interaction) {
        database.findOne('ticket', 'tickets', { channelId: interaction.channel.id }, async (result) => {
            let data = result
            data.category = interaction.values[0];
            data.locked = false;
            const category_data = categories.options.filter(object => object.value === data.category)[0]
            database.delete('ticket', 'tickets', { channelId: result.channelId })
            database.insertOne('ticket', 'tickets', data)
            const embed = new EmbedBuilder()
                .setTitle(category_data.embed_title.replaceAll("%target_id%", interaction.member.user.id).replaceAll("%target%", interaction.member.user.username))
                .setDescription(category_data.embed_content.replaceAll("%target_id%", interaction.member.user.id).replaceAll("%target%", interaction.member.user.username))
                .setColor(config.color)
            const row = new ActionRowBuilder()
                .addComponents(ticket_close.builder)
            await interaction.update({embeds: [embed], components: [row]})
        })
    }
}