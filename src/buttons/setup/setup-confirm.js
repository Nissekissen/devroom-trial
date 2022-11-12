const { ChannelType, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, Embed, PermissionsBitField } = require("discord.js");
const config = require('../../../config.json')
const ticket_create = require('../create-ticket/ticket-create')

const embed_data = require('../../../config/embeds.json');
const Channel = require("../../db/models/Channel");

module.exports = {
    builder: new ButtonBuilder()
        .setLabel('Confirm')
        .setCustomId('setup-confirm')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(false),
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
        let admin_channel;
        let role;
        if (!start_channel) {
            start_channel = await category.children.create({
                name: 'open-ticket',
                type: ChannelType.GuildText
            })
            role = await interaction.guild.roles.create({
                name: 'Ticket Support',
                color: config.color
            })
            admin_channel = await category.children.create({
                name: 'incoming-tickets',
                type: ChannelType.GuildText,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: [PermissionsBitField.Flags.ViewChannel]
                    },
                    {
                        id: role.id,
                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
                    }
                ]
            })
        } else {
            const embed = new EmbedBuilder()
                .setTitle(embed_data.setup_confirm_already_setup_embed.title)
                .setColor(config.color)
                .setDescription(embed_data.setup_confirm_already_setup_embed.content)
            const row = new ActionRowBuilder()
                .addComponents(this.builder.setDisabled(true))
            return await interaction.update({ embeds: [embed], components: [row] })
        }
        const messageRow = new ActionRowBuilder()
            .setComponents(ticket_create.builder)
        const messageEmbed = new EmbedBuilder()
            .setTitle(embed_data.ticket_create_embed.title)
            .setDescription(embed_data.ticket_create_embed.content)
            .setColor(config.color)
        
        Channel.create({
            openTicket: start_channel.id,
            ticketCategory: category.id,
            adminChannel: admin_channel.id,
            supportRole: role.id
        })

        await start_channel.send({ embeds: [messageEmbed], components: [messageRow] })
        const embed = new EmbedBuilder()
            .setTitle(embed_data.setup_confirm_complete_embed.title)
            .setColor(config.color)
            .setDescription(embed_data.setup_confirm_complete_embed.content)
        const row = new ActionRowBuilder()
            .addComponents(this.builder.setDisabled(true))
        await interaction.update({ embeds: [embed], components: [row] })
    }
}