const { SelectMenuBuilder, EmbedBuilder, ActionRowBuilder } = require("discord.js");
const config = require('../../../config.json')

const wait = require('node:timers/promises').setTimeout;

const ticket_close = require('./ticket-close')
const categories = require('../../../config/categories.json');
const Ticket = require("../../db/models/Ticket");

module.exports = {
    builder: new SelectMenuBuilder()
        .setCustomId('ticket-category')
        .setPlaceholder('Select a category.')
        .addOptions(categories.options),
    async execute(interaction) {
        await Ticket.findOneAndUpdate({ channelId: interaction.channel.id }, { category: interaction.values[0], locked: false })

        const category_data = categories.options.filter(object => object.value === interaction.values[0])[0]

        const embed = new EmbedBuilder()
                .setTitle(category_data.embed_title.replaceAll("%target_id%", interaction.member.user.id).replaceAll("%target%", interaction.member.user.username))
                .setDescription(category_data.embed_content.replaceAll("%target_id%", interaction.member.user.id).replaceAll("%target%", interaction.member.user.username))
                .setColor(config.color)
            const row = new ActionRowBuilder()
                .addComponents(ticket_close.builder)
            await interaction.update({embeds: [embed], components: [row]})
    }
}