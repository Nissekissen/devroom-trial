const handler = require('./database')

module.exports = (channelId, categoryId, adminchannelId) => {
    try {
        handler.createDB('ticket');
        console.log('Created database')
        handler.createCollection('ticket', 'channel');
        console.log('created collection "channel"')
        handler.insertOne('ticket', 'channel', { name: 'open-ticket', id: channelId });
        handler.insertOne('ticket', 'channel', { name: 'ticket-category', id: categoryId });
        handler.insertOne('ticket', 'channel', { name: 'admin-channel', id: adminchannelId });
        console.log('inserted data into "channel"')
        handler.createCollection('ticket', 'tickets');
        console.log('created collection "tickets"')
    } catch (error) {
        throw error;
    }
}