const { SelectMenuBuilder, ButtonBuilder, ButtonStyle, ChannelType, EmbedBuilder, ActionRowBuilder, PermissionsBitField } = require("discord.js");
const config = require('../../../config.json')

const ticket_category = require('./ticket-category')
const ticket_cancel = require('./ticket-cancel')

const embed_data = require('../../../config/embeds.json');

const Ticket = require("../../db/models/Ticket");
const Channel = require('../../db/models/Channel')

module.exports = {
    builder: new ButtonBuilder()
        .setLabel('Create Ticket')
        .setEmoji('📝')
        .setStyle(ButtonStyle.Primary)
        .setCustomId(`ticket-create`),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const data = await Channel.findOne({})
        const category_id = data.ticketCategory;
        const role_id = data.supportRole;

        const category = interaction.guild.channels.cache.get(category_id);
        const channel = await category.children.create({
            name: `ticket-${interaction.member.user.tag}`,
            type: ChannelType.GuildText,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: [PermissionsBitField.Flags.ViewChannel]
                },
                {
                    id: interaction.user.id,
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
                },
                {
                    id: role_id,
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
                }
            ]
        })
    
        const embed = new EmbedBuilder()
            .setTitle(embed_data.category_selection_embed.title.replaceAll("%target%", interaction.member.user.username))
            .setDescription(embed_data.category_selection_embed.content)
            .setColor(config.color)
        const selectMenuRow = new ActionRowBuilder()
            .setComponents(ticket_category.builder)
        const cancelRow = new ActionRowBuilder()
            .setComponents(ticket_cancel.builder)
    
        await channel.send({embeds: [embed], components: [selectMenuRow, cancelRow]});
                
        Ticket.create({
            userId: interaction.member.id,
            channelId: channel.id,
            locked: true,
            notified: false
        })

        await interaction.editReply({ content: embed_data.ticket_create_message.content.replaceAll("%channel_id%", channel.id), ephemeral: true  })
    }
}