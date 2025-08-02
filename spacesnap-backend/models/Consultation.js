// models/Consultation.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    // This is a great idea for future expansion
    // replies: [{ from: String, message: String, date: Date }]
}, { timestamps: true }); // `createdAt` and `updatedAt` are automatically managed

const Consultation = mongoose.model('Consultation', consultationSchema);
module.exports = Consultation;