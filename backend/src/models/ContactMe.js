const mongoose = require('mongoose')
const { Schema } = mongoose

const contactMeSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters'],
            maxlength: [50, 'Name cannot exceed 50 characters'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            trim: true,
            lowercase: true,
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email'],
        },
        phone: {
            type: String,
            trim: true,
            match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please provide a valid phone number'],
        },
        subject: {
            type: String,
            required: [true, 'Subject is required'],
            trim: true,
            minlength: [5, 'Subject must be at least 5 characters'],
            maxlength: [100, 'Subject cannot exceed 100 characters'],
        },
        message: {
            type: String,
            required: [true, 'Message is required'],
            trim: true,
            minlength: [10, 'Message must be at least 10 characters'],
            maxlength: [1000, 'Message cannot exceed 1000 characters'],
        },
        status: {
            type: String,
            enum: ['new', 'read', 'replied', 'archived'],
            default: 'new',
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'medium',
        },
        ipAddress: {
            type: String,
            required: true,
        },
        userAgent: {
            type: String,
        },
        isSpam: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt
        versionKey: false,
    }
)

// Indexes for better query performance
contactMeSchema.index({ email: 1 })
contactMeSchema.index({ status: 1 })
contactMeSchema.index({ createdAt: -1 })
contactMeSchema.index({ isSpam: 1, status: 1 })

// Virtual for full name
contactMeSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`
})

// Pre-save middleware for data sanitization
contactMeSchema.pre('save', function (next) {
    // Additional sanitization can be added here
    next()
})

module.exports = mongoose.model('ContactMe', contactMeSchema)
