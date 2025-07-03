// models/Consultation.js
const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema({
    user: { // The user requesting the consultation
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    designer: { // The designer they selected
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    subject: {
        type: String,
        required: [true, 'Please provide a subject for your consultation.'],
    },
    message: {
        type: String,
        required: [true, 'Please provide a message detailing your request.'],
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Completed', 'Cancelled'],
        default: 'Pending',
    },
    // We can add fields for replies later
    // replies: [{ from: String, message: String, date: Date }]
}, { timestamps: true });

const Consultation = mongoose.model('Consultation', consultationSchema);
module.exports = Consultation;