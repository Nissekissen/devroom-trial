const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

const embeds = require('../../config/embeds.json');
const config = require('../../config.json')
const Channel = require("../db/models/Channel");
const Ticket = require("../db/models/Ticket");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reset')
        .setDescription('Reset the bot completely.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),
    async execute(interaction) {
        const embedData = embeds.reset_embed;

        const data = await Channel.findOne({})

        const category = interaction.guild.channels.cache.get(data.ticketCategory)
        category.children.cache.forEach(async channel => await channel.delete())
        await category.delete();

        await Ticket.deleteMany({})
        await Channel.deleteMany({})

        const embed = new EmbedBuilder()
            .setTitle(embedData.title)
            .setDescription(embedData.content)
            .setColor(config.color)
        await interaction.reply({ embeds: [embed], ephemeral: true })
    }
}