const validator = require('validator')

class CustomValidators {
    /**
     * Validate email address
     * @param {string} email - Email to validate
     * @returns {object} - Validation result
     */
    static validateEmail(email) {
        if (!email) {
            return { isValid: false, message: 'Email is required' }
        }

        if (!validator.isEmail(email)) {
            return { isValid: false, message: 'Please provide a valid email address' }
        }

        return { isValid: true, message: 'Valid email' }
    }

    /**
     * Validate phone number
     * @param {string} phone - Phone number to validate
     * @param {boolean} required - Whether phone is required
     * @returns {object} - Validation result
     */
    static validatePhone(phone, required = false) {
        if (!phone && required) {
            return { isValid: false, message: 'Phone number is required' }
        }

        if (!phone && !required) {
            return { isValid: true, message: 'Phone number is optional' }
        }

        // Remove all non-numeric characters for validation
        const cleanPhone = phone.replace(/\D/g, '')

        if (cleanPhone.length < 10 || cleanPhone.length > 15) {
            return { isValid: false, message: 'Phone number must be between 10-15 digits' }
        }

        return { isValid: true, message: 'Valid phone number' }
    }

    /**
     * Validate name (first name, last name)
     * @param {string} name - Name to validate
     * @param {string} fieldName - Field name for error message
     * @returns {object} - Validation result
     */
    static validateName(name, fieldName = 'Name') {
        if (!name) {
            return { isValid: false, message: `${fieldName} is required` }
        }

        const trimmedName = name.trim()

        if (trimmedName.length < 2) {
            return { isValid: false, message: `${fieldName} must be at least 2 characters long` }
        }

        if (trimmedName.length > 50) {
            return { isValid: false, message: `${fieldName} cannot exceed 50 characters` }
        }

        // Check for valid characters (letters, spaces, hyphens, apostrophes)
        const nameRegex = /^[a-zA-Z\s\-']+$/
        if (!nameRegex.test(trimmedName)) {
            return { isValid: false, message: `${fieldName} contains invalid characters` }
        }

        return { isValid: true, message: `Valid ${fieldName.toLowerCase()}` }
    }

    /**
     * Validate subject line
     * @param {string} subject - Subject to validate
     * @returns {object} - Validation result
     */
    static validateSubject(subject) {
        if (!subject) {
            return { isValid: false, message: 'Subject is required' }
        }

        const trimmedSubject = subject.trim()

        if (trimmedSubject.length < 5) {
            return { isValid: false, message: 'Subject must be at least 5 characters long' }
        }

        if (trimmedSubject.length > 100) {
            return { isValid: false, message: 'Subject cannot exceed 100 characters' }
        }

        return { isValid: true, message: 'Valid subject' }
    }

    /**
     * Validate message content
     * @param {string} message - Message to validate
     * @returns {object} - Validation result
     */
    static validateMessage(message) {
        if (!message) {
            return { isValid: false, message: 'Message is required' }
        }

        const trimmedMessage = message.trim()

        if (trimmedMessage.length < 10) {
            return { isValid: false, message: 'Message must be at least 10 characters long' }
        }

        if (trimmedMessage.length > 1000) {
            return { isValid: false, message: 'Message cannot exceed 1000 characters' }
        }

        return { isValid: true, message: 'Valid message' }
    }

    /**
     * Validate contact status
     * @param {string} status - Status to validate
     * @returns {object} - Validation result
     */
    static validateStatus(status) {
        const validStatuses = ['new', 'read', 'replied', 'archived']

        if (!status) {
            return { isValid: false, message: 'Status is required' }
        }

        if (!validStatuses.includes(status)) {
            return {
                isValid: false,
                message: `Status must be one of: ${validStatuses.join(', ')}`,
            }
        }

        return { isValid: true, message: 'Valid status' }
    }

    /**
     * Validate priority level
     * @param {string} priority - Priority to validate
     * @returns {object} - Validation result
     */
    static validatePriority(priority) {
        const validPriorities = ['low', 'medium', 'high']

        if (!priority) {
            return { isValid: true, message: 'Priority is optional, defaults to medium' }
        }

        if (!validPriorities.includes(priority)) {
            return {
                isValid: false,
                message: `Priority must be one of: ${validPriorities.join(', ')}`,
            }
        }

        return { isValid: true, message: 'Valid priority' }
    }

    /**
     * Validate MongoDB ObjectId
     * @param {string} id - ID to validate
     * @returns {object} - Validation result
     */
    static validateObjectId(id) {
        if (!id) {
            return { isValid: false, message: 'ID is required' }
        }

        if (!validator.isMongoId(id)) {
            return { isValid: false, message: 'Invalid ID format' }
        }

        return { isValid: true, message: 'Valid ID' }
    }

    /**
     * Validate pagination parameters
     * @param {number} page - Page number
     * @param {number} limit - Items per page
     * @returns {object} - Validation result
     */
    static validatePagination(page, limit) {
        const errors = []

        if (page && (!Number.isInteger(Number(page)) || Number(page) < 1)) {
            errors.push('Page must be a positive integer')
        }

        if (limit && (!Number.isInteger(Number(limit)) || Number(limit) < 1 || Number(limit) > 100)) {
            errors.push('Limit must be a positive integer between 1 and 100')
        }

        if (errors.length > 0) {
            return { isValid: false, message: errors.join(', ') }
        }

        return { isValid: true, message: 'Valid pagination parameters' }
    }

    /**
     * Check for potential spam content
     * @param {object} contactData - Contact form data
     * @returns {object} - Spam check result
     */
    static checkSpam(contactData) {
        const spamKeywords = [
            'casino',
            'lottery',
            'winner',
            'congratulations',
            'viagra',
            'cialis',
            'penis',
            'enlargement',
            'weight loss',
            'make money',
            'work from home',
            'free money',
            'click here',
            'act now',
            'limited time',
            'urgent',
            'immediate',
            'bitcoin',
            'cryptocurrency',
        ]

        const { subject = '', message = '', email = '' } = contactData
        const content = `${subject} ${message} ${email}`.toLowerCase()

        const spamScore = spamKeywords.reduce((score, keyword) => {
            const occurrences = (content.match(new RegExp(keyword, 'g')) || []).length
            return score + occurrences
        }, 0)

        // Check for excessive links
        const linkCount = (content.match(/http[s]?:\/\//g) || []).length
        const totalScore = spamScore + linkCount * 2

        const isSpam = totalScore >= 3

        return {
            isSpam,
            score: totalScore,
            message: isSpam ? 'Content flagged as potential spam' : 'Content appears legitimate',
        }
    }

    /**
     * Validate complete contact form data
     * @param {object} data - Contact form data
     * @returns {object} - Complete validation result
     */
    static validateContactForm(data) {
        const errors = []
        const { firstName, lastName, email, phone, subject, message } = data

        // Validate required fields
        const firstNameValidation = this.validateName(firstName, 'First name')
        if (!firstNameValidation.isValid) errors.push(firstNameValidation.message)

        const lastNameValidation = this.validateName(lastName, 'Last name')
        if (!lastNameValidation.isValid) errors.push(lastNameValidation.message)

        const emailValidation = this.validateEmail(email)
        if (!emailValidation.isValid) errors.push(emailValidation.message)

        const subjectValidation = this.validateSubject(subject)
        if (!subjectValidation.isValid) errors.push(subjectValidation.message)

        const messageValidation = this.validateMessage(message)
        if (!messageValidation.isValid) errors.push(messageValidation.message)

        // Validate optional phone
        if (phone) {
            const phoneValidation = this.validatePhone(phone, false)
            if (!phoneValidation.isValid) errors.push(phoneValidation.message)
        }

        // Check for spam
        const spamCheck = this.checkSpam(data)

        return {
            isValid: errors.length === 0,
            errors,
            spamCheck,
        }
    }
}

module.exports = CustomValidators
