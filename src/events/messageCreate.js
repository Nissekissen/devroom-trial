const { ActionRowBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const database = require("../db/database");

const wait = require('node:timers/promises').setTimeout;

const config = require('../../config.json')
const embed_data = require('../../config/embeds.json');
const notificationDismiss = require("../buttons/notification/notification-dismiss");

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

                        

                        database.findOne('ticket', 'channel', { name: 'admin-channel' }, async (result) => {
                            const channel = message.guild.channels.cache.get(result.id);
                            database.findOne('ticket', 'tickets', { channelId: message.channel.id }, async (res) => {

                                database.findOne('ticket', 'channel', { name: 'support-role' }, async (role) => {
                                    if (res.notified) return;

                                    const embeddata = embed_data.notify_support_confirm_embed
                                    const notification_embed = new EmbedBuilder()
                                        .setTitle(embeddata.title)
                                        .setDescription(embeddata.content)
                                        .setColor(config.color)
                            
                                    await message.channel.send({ embeds: [notification_embed] })
    
                                    const row = new ActionRowBuilder()
                                        .addComponents(notificationDismiss.builder)
                                    const embed = new EmbedBuilder()
                                        .setTitle(embed_data.new_ticket_notification_embed.title.replaceAll("%category%", res.category).replaceAll("%ticket_owner_id%", res.userId).replaceAll("%channel_id%", res.Id))
                                        .setDescription(embed_data.new_ticket_notification_embed.content.replaceAll("%category%", res.category).replaceAll("%ticket_owner_id%", res.userId).replaceAll("%channel_id%", res.channelId))
                                        .setColor(config.color)
                                    let data = res;
                                    data.notifyChannel = result.id;
                                    data.notified = true
                                    await database.delete('ticket', 'tickets', { channelId: res.channelId })
                                    await wait(100);
                                    await database.insertOne('ticket', 'tickets', data)
                                    await channel.send({ content: `<@&${role.id}>`, embeds: [embed], components: [row] })
                                })
                            })
                        })
                    }
                }
            }
        })
    }
}