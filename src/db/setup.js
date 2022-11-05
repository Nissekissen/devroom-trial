const handler = require('./database')

module.exports = async (channelId, categoryId, adminchannelId, support_role_id) => {
    try {
        await handler.createDB('ticket');
        await handler.createCollection('ticket', 'channel');
        await handler.insertOne('ticket', 'channel', { name: 'open-ticket', id: channelId });
        await handler.insertOne('ticket', 'channel', { name: 'ticket-category', id: categoryId });
        await handler.insertOne('ticket', 'channel', { name: 'admin-channel', id: adminchannelId });
        await handler.insertOne('ticket', 'channel', { name: 'support-role', id: support_role_id });
        await handler.createCollection('ticket', 'tickets');
    } catch (error) {
        throw error;
    }
}