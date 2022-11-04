const { ChannelType, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, Embed } = require("discord.js");
const config = require('../../../config.json')
const ticket_create = require('../create-ticket/ticket-create')

module.exports = {
    builder: new ButtonBuilder()
        .setLabel('Confirm')
        .setCustomId('setup-confirm')
        .setStyle(ButtonStyle.Primary),
    async execute(interaction, id) {
        // setup-confirm
        let category = interaction.guild.channels.cache.find(channel => channel.name === 'tickets' && channel.type === ChannelType.GuildCategory);
        if (!category) {
            category = await interaction.guild.channels.create({
                name: 'tickets',
                type: ChannelType.GuildCategory
            })
        }
        let start_channel = interaction.guild.channels.cache.find(channel => channel.name === 'open-ticket');
        if (!start_channel) {
            start_channel = await category.children.create({
                name: 'open-ticket',
                type: ChannelType.GuildText
            })
        } else {
            const embed = new EmbedBuilder()
                .setTitle('Already Setup.')
                .setColor(config.color)
                .setDescription('Server is already setup. You can dismiss this message.')
            const row = new ActionRowBuilder()
                .addComponents(this.builder.setDisabled(true))
            return await interaction.update({ embeds: [embed], components: [row] })
        }
        const messageRow = new ActionRowBuilder()
            .setComponents(ticket_create.builder)
        const messageEmbed = new EmbedBuilder()
            .setTitle('Create a Ticket')
            .setDescription('Click on the button below to start a ticket.')
            .setColor(config.color)
        
        await start_channel.send({ embeds: [messageEmbed], components: [messageRow] })
        
        const embed = new EmbedBuilder()
            .setTitle('Already Setup.')
            .setColor(config.color)
            .setDescription('Server is now setup. you can dismiss this message.')
        const row = new ActionRowBuilder()
            .addComponents(this.builder.setDisabled(true))
        await interaction.update({ embeds: [embed], components: [row] })
    }
}