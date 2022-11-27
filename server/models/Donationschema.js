const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    organization: {
        type: String,
        required: true
    },
    donated : {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
});

const Donation = mongoose.model('Donation', DonationSchema);
module.exports = Donation;