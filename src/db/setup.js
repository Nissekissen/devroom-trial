const handler = require('./database')

module.exports = (channelId) => {
    try {
        handler.createDB('ticket');
        handler.createCollection('ticket', 'channel');
        handler.insertOne('ticket', 'channel', { name: 'open-ticket', id: channelId });
        handler.createCollection('ticket', 'tickets');
        return true;
    } catch (error) {
        console.log('Error while setting up database: ' + error);
        return false;
    }
}