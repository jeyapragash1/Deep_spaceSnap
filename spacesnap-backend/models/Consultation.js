// models/Consultation.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// --- NEW: Define a schema for individual messages ---
const ReplySchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    message: {
        type: String,
        required: true,
        trim: true,
    }
}, { timestamps: true });


const consultationSchema = new Schema({
    user: { 
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    designer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    subject: {
        type: String,
        required: [true, 'Please provide a subject for your consultation.'],
        trim: true,
    },
    message: {
        type: String,
        required: [true, 'Please provide a message detailing your request.'],
        trim: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Completed', 'Cancelled'],
        default: 'Pending',
    },
    // --- THIS IS THE UPGRADE ---
    // An array to hold all replies for this consultation thread
    replies: [ReplySchema] 
}, { timestamps: true });

const Consultation = mongoose.model('Consultation', consultationSchema);
module.exports = Consultation;