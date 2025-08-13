// spacesnap-backend/models/PortfolioItem.js

const mongoose = require('mongoose');

const PortfolioItemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    designer: { type: String, required: true },
    style: { type: String, required: true, lowercase: true },
    description: { type: String, required: true },
    details: [{ type: String }],
    image: {
        public_id: { type: String, required: true },
        url: { type: String, required: true }
    },
}, { timestamps: true });

module.exports = mongoose.model('PortfolioItem', PortfolioItemSchema);