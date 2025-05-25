const contactService = require('../src/services/contactService')
const { responseFormatter } = require('../utils')
const { STATUS_CODES, MESSAGES } = require('../constants')

class ContactMeController {
    // Create new contact
    async createContact(req, res, next) {
        try {
            const contactData = {
                ...req.body,
                ipAddress: req.ip,
                userAgent: req.get('User-Agent'),
            }

            const contact = await contactService.createContact(contactData)

            const response = responseFormatter.success(contact, MESSAGES.CONTACT.CREATED, STATUS_CODES.CREATED)

            res.status(STATUS_CODES.CREATED).json(response)
        } catch (error) {
            next(error)
        }
    }

    // Get all contacts (admin only)
    async getAllContacts(req, res, next) {
        try {
            const { page = 1, limit = 10, status, priority } = req.query
            const filters = { status, priority }

            const result = await contactService.getAllContacts(parseInt(page), parseInt(limit), filters)

            const response = responseFormatter.success(result, MESSAGES.CONTACT.RETRIEVED)

            res.json(response)
        } catch (error) {
            next(error)
        }
    }

    // Get contact by ID
    async getContactById(req, res, next) {
        try {
            const contact = await contactService.getContactById(req.params.id)

            if (!contact) {
                return res.status(STATUS_CODES.NOT_FOUND).json(responseFormatter.error(MESSAGES.CONTACT.NOT_FOUND))
            }

            const response = responseFormatter.success(contact, MESSAGES.CONTACT.RETRIEVED)

            res.json(response)
        } catch (error) {
            next(error)
        }
    }

    // Update contact status
    async updateContactStatus(req, res, next) {
        try {
            const { id } = req.params
            const { status } = req.body

            const contact = await contactService.updateContactStatus(id, status)

            if (!contact) {
                return res.status(STATUS_CODES.NOT_FOUND).json(responseFormatter.error(MESSAGES.CONTACT.NOT_FOUND))
            }

            const response = responseFormatter.success(contact, MESSAGES.CONTACT.UPDATED)

            res.json(response)
        } catch (error) {
            next(error)
        }
    }

    // Delete contact
    async deleteContact(req, res, next) {
        try {
            const deleted = await contactService.deleteContact(req.params.id)

            if (!deleted) {
                return res.status(STATUS_CODES.NOT_FOUND).json(responseFormatter.error(MESSAGES.CONTACT.NOT_FOUND))
            }

            const response = responseFormatter.success(null, MESSAGES.CONTACT.DELETED)

            res.json(response)
        } catch (error) {
            next(error)
        }
    }

    // Get contact statistics
    async getContactStats(req, res, next) {
        try {
            const stats = await contactService.getContactStats()

            const response = responseFormatter.success(stats, MESSAGES.CONTACT.STATS_RETRIEVED)

            res.json(response)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new ContactMeController()
