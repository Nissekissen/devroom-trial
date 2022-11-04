const { ActionRowBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const database = require("../db/database");

const config = require('../../config.json')
const embed_data = require('../../config/embeds.json')

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        if (message.author.id == message.client.application.id) return;
        database.find('ticket', 'tickets', {}, async (channels) => {
            for (const channel of channels) {
                if (message.channel.id === channel.channelId) {
                    if (channel.locked) {
                        await message.delete();
                    } else {
                        const data = embed_data.notify_support_confirm_embed
                        const embed = new EmbedBuilder()
                            .setTitle(data.title)
                            .setDescription(data.content)
                            .setColor(config.color)
                        
                        await message.channel.send({ embeds: [embed] })

                        database.findOne('ticket', 'channel', { name: 'admin-channel' }, async (result) => {
                            const channel = message.guild.channels.cache.get(result.id);
                            database.findOne('ticket', 'tickets', { channelId: message.channel.id }, async (res) => {
                                console.log(res)
                                const embed = new EmbedBuilder()
                                    .setTitle(embed_data.new_ticket_notification_embed.title.replaceAll("%category%", res.category).replaceAll("%ticket_owner_id%", res.userId).replaceAll("%channel_id%", res.Id))
                                    .setDescription(embed_data.new_ticket_notification_embed.content.replaceAll("%category%", res.category).replaceAll("%ticket_owner_id%", res.userId).replaceAll("%channel_id%", res.channelId))
                                    .setColor(config.color)
                                await channel.send({ embeds: [embed] })
                            })
                            
                        })
                    }
                }
            }
        })
    }
}