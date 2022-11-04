const { SelectMenuBuilder, ButtonBuilder, ButtonStyle, ChannelType, EmbedBuilder, ActionRowBuilder } = require("discord.js");
const database = require('../../db/database')
const config = require('../../../config.json')

const ticket_category = require('./ticket-category')
const ticket_cancel = require('./ticket-cancel')


const embed_data = require('../../../config/embeds.json')

module.exports = {
    builder: new ButtonBuilder()
        .setLabel('Create Ticket')
        .setEmoji('📝')
        .setStyle(ButtonStyle.Primary)
        .setCustomId(`ticket-create`),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const category_id = database.findOne('ticket', 'channel', { name: 'ticket-category' }, async (result) => {
            const category = interaction.guild.channels.cache.get(result.id);
            const channel = await category.children.create({
                name: `ticket-${interaction.member.user.tag}`,
                type: ChannelType.GuildText
            })

            const embed = new EmbedBuilder()
                .setTitle(embed_data.ticket_create_embed.title.replace("%target%", interaction.member.user.username))
                .setDescription(embed_data.ticket_create_embed.content)
                .setColor(config.color)
            const selectMenuRow = new ActionRowBuilder()
                .setComponents(ticket_category.builder)
            const cancelRow = new ActionRowBuilder()
                .setComponents(ticket_cancel.builder)

            await channel.send({embeds: [embed], components: [selectMenuRow, cancelRow]});

            const data = {
                userId: interaction.member.id,
                channelId: channel.id,
                locked: true,
                notified: false
            }
            database.insertOne('ticket', 'tickets', data)

            await interaction.editReply({ content: embed_data.ticket_create_message.content.replaceAll("%channel_id%", channel.id), ephemeral: true  })
        })

        
        
    }
}