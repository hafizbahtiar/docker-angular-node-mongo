const express = require('express')
const router = express.Router()
const contactController = require('../controllers/contactController')
const { validateContact, validateContactStatus } = require('../middlewares/validation')
const rateLimiter = require('../middlewares/rateLimiter')

// Public routes
router.post(
    '/',
    rateLimiter.contactForm, // Rate limiting for contact form
    validateContact,
    contactController.createContact
)

// Admin routes (add authentication middleware as needed)
router.get('/', contactController.getAllContacts)
router.get('/stats', contactController.getContactStats)
router.get('/:id', contactController.getContactById)
router.patch('/:id/status', validateContactStatus, contactController.updateContactStatus)
router.delete('/:id', contactController.deleteContact)

module.exports = router
