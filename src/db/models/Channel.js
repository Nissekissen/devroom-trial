const { Schema, model } = require('mongoose');

const Channel = new Schema({
    openTicket: String,
    ticketCategory: String,
    adminChannel: String,
    supportRole: String
})

module.exports = model('Channel', Channel);