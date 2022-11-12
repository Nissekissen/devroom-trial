const { ActionRowBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

const Ticket = require('../db/models/Ticket')
const Channel = require('../db/models/Channel')

const config = require('../../config.json')
const embed_data = require('../../config/embeds.json');
const notificationDismiss = require("../buttons/notification/notification-dismiss");

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        if (message.author.id == message.client.application.id) return;

        const tickets = await Ticket.find({})
        for (const ticket of tickets) {
            if (message.channel.id != ticket.channelId) continue;
            if (ticket.locked) return await message.delete();
            if (ticket.notified) return;

            const data = await Channel.findOne({})

            const channel = message.guild.channels.cache.get(data.adminChannel)
            

            const embeddata = embed_data.notify_support_confirm_embed
            const notification_embed = new EmbedBuilder()
                .setTitle(embeddata.title)
                .setDescription(embeddata.content)
                .setColor(config.color)
    
            await message.channel.send({ embeds: [notification_embed] })

            const row = new ActionRowBuilder()
                .addComponents(notificationDismiss.builder)
            const embed = new EmbedBuilder()
                .setTitle(embed_data.new_ticket_notification_embed.title.replaceAll("%category%", ticket.category).replaceAll("%ticket_owner_id%", ticket.userId).replaceAll("%channel_id%", ticket.channelId))
                .setDescription(embed_data.new_ticket_notification_embed.content.replaceAll("%category%", ticket.category).replaceAll("%ticket_owner_id%", ticket.userId).replaceAll("%channel_id%", ticket.channelId))
                .setColor(config.color)
            
            await Ticket.findOneAndUpdate({ channelId: ticket.channelId }, { notifyChannel: data.adminChannel, notified: true })

            await channel.send({ content: `<@&${data.supportRole}>`, embeds: [embed], components: [row] })
            
        }
    }
}