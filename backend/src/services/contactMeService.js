const Contact = require('../models/Contact')
// const emailService = require('./emailService')

class ContactMeService {
    async createContact(contactData) {
        try {
            // Create new contact
            const contact = new Contact(contactData)
            await contact.save()

            // Send notification email (optional)
            // try {
            //     await emailService.sendContactNotification(contact)
            // } catch (emailError) {
            //     console.log('Failed to send contact notification email:', emailError)
            //     // Don't throw error - contact should still be created
            // }

            console.log(`New contact created: ${contact._id}`)
            return contact
        } catch (error) {
            console.log('Error creating contact:', error)
            throw error
        }
    }

    async getAllContacts(page = 1, limit = 10, filters = {}) {
        try {
            const skip = (page - 1) * limit

            // Build query
            const query = {}
            if (filters.status) query.status = filters.status
            if (filters.priority) query.priority = filters.priority
            if (filters.isSpam !== undefined) query.isSpam = filters.isSpam

            // Execute queries in parallel
            const [contacts, total] = await Promise.all([
                Contact.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
                Contact.countDocuments(query),
            ])

            return {
                contacts,
                pagination: {
                    current: page,
                    pages: Math.ceil(total / limit),
                    total,
                    hasNext: page < Math.ceil(total / limit),
                    hasPrev: page > 1,
                },
            }
        } catch (error) {
            console.log('Error fetching contacts:', error)
            throw error
        }
    }

    async getContactById(id) {
        try {
            const contact = await Contact.findById(id)

            if (contact && contact.status === 'new') {
                contact.status = 'read'
                await contact.save()
            }

            return contact
        } catch (error) {
            console.log('Error fetching contact by ID:', error)
            throw error
        }
    }

    async updateContactStatus(id, status) {
        try {
            const contact = await Contact.findByIdAndUpdate(id, { status }, { new: true, runValidators: true })

            if (contact) {
                console.log(`Contact ${id} status updated to ${status}`)
            }

            return contact
        } catch (error) {
            console.log('Error updating contact status:', error)
            throw error
        }
    }

    async deleteContact(id) {
        try {
            const contact = await Contact.findByIdAndDelete(id)

            if (contact) {
                console.log(`Contact deleted: ${id}`)
            }

            return contact
        } catch (error) {
            console.log('Error deleting contact:', error)
            throw error
        }
    }

    async getContactStats() {
        try {
            const stats = await Contact.aggregate([
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        new: { $sum: { $cond: [{ $eq: ['$status', 'new'] }, 1, 0] } },
                        read: { $sum: { $cond: [{ $eq: ['$status', 'read'] }, 1, 0] } },
                        replied: { $sum: { $cond: [{ $eq: ['$status', 'replied'] }, 1, 0] } },
                        archived: { $sum: { $cond: [{ $eq: ['$status', 'archived'] }, 1, 0] } },
                        spam: { $sum: { $cond: ['$isSpam', 1, 0] } },
                    },
                },
            ])

            return (
                stats[0] || {
                    total: 0,
                    new: 0,
                    read: 0,
                    replied: 0,
                    archived: 0,
                    spam: 0,
                }
            )
        } catch (error) {
            console.log('Error fetching contact stats:', error)
            throw error
        }
    }
}

module.exports = new ContactMeService()
