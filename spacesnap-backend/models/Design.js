// models/Design.js
const mongoose = require('mongoose');

const designSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        default: 'Untitled Design',
    },
    // This will store all the design data as a JSON string
    // e.g., wall colors, floor patterns, placed objects and their positions
    designData: {
        type: String,
        required: true,
    },
    // A thumbnail image for quick preview
    thumbnail: {
        type: String, // URL to a small image of the design
    },
}, { timestamps: true });

const Design = mongoose.model('Design', designSchema);
module.exports = Design;