const mongoose = require('mongoose');

const Ticket = mongoose.Schema({
    userId: String,
    channelId: String,
    locked: Boolean,
    notified: Boolean,
    notifyChannel: String,
    category: String
})

module.exports = mongoose.model('Ticket', Ticket);