const mongoose = require('mongoose');
const bycrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const requestSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    org_name: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    address: {
        type: String,
        required: true
    },

    deadline: {
        type: String,
        required: true
    },

    type : {
        type: String,
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    timestamp: {
       type : Date,
       default: Date.now
    },
});

const Request = new mongoose.model('REQUEST', requestSchema);
module.exports = Request;
