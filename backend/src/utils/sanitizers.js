const validator = require('validator');
const xss = require('xss');

class DataSanitizers {
  /**
   * Sanitize string input - remove XSS, trim, escape
   * @param {string} input - String to sanitize
   * @param {object} options - Sanitization options
   * @returns {string} - Sanitized string
   */
  static sanitizeString(input, options = {}) {
    if (!input || typeof input !== 'string') {
      return '';
    }
    
    let sanitized = input;
    
    // Trim whitespace
    if (options.trim !== false) {
      sanitized = sanitized.trim();
    }
    
    // Remove XSS
    if (options.xss !== false) {
      sanitized = xss(sanitized, {
        whiteList: {}, // No HTML allowed
        stripIgnoreTag: true,
        stripIgnoreTagBody: ['script']
      });
    }
    
    // Escape HTML
    if (options.escape === true) {
      sanitized = validator.escape(sanitized);
    }
    
    // Convert to lowercase
    if (options.lowercase === true) {
      sanitized = sanitized.toLowerCase();
    }
    
    // Remove extra spaces
    if (options.normalizeSpaces !== false) {
      sanitized = sanitized.replace(/\s+/g, ' ');
    }
    
    return sanitized;
  }

  /**
   * Sanitize email address
   * @param {string} email - Email to sanitize
   * @returns {string} - Sanitized email
   */
  static sanitizeEmail(email) {
    if (!email || typeof email !== 'string') {
      return '';
    }
    
    // Normalize email
    const sanitized = validator.normalizeEmail(email.trim().toLowerCase(), {
      gmail_remove_dots: false,
      gmail_remove_subaddress: false,
      outlookdotcom_remove_subaddress: false,
      yahoo_remove_subaddress: false,
      icloud_remove_subaddress: false
    });
    
    return sanitized || '';
  }

  /**
   * Sanitize phone number
   * @param {string} phone - Phone number to sanitize
   * @returns {string} - Sanitized phone number
   */
  static sanitizePhone(phone) {
    if (!phone || typeof phone !== 'string') {
      return '';
    }
    
    // Remove all non-numeric characters except + for international numbers
    let sanitized = phone.trim().replace(/[^\d+]/g, '');
    
    // If starts with + keep it, otherwise remove any + signs
    if (!sanitized.startsWith('+')) {
      sanitized = sanitized.replace(/\+/g, '');
    }
    
    return sanitized;
  }

  /**
   * Sanitize name (first name, last name)
   * @param {string} name - Name to sanitize
   * @returns {string} - Sanitized name
   */
  static sanitizeName(name) {
    if (!name || typeof name !== 'string') {
      return '';
    }
    
    let sanitized = this.sanitizeString(name, { 
      trim: true, 
      xss: true, 
      normalizeSpaces: true 
    });
    
    // Remove numbers and special characters except spaces, hyphens, apostrophes
    sanitized = sanitized.replace(/[^a-zA-Z\s\-']/g, '');
    
    // Capitalize first letter of each word
    sanitized = sanitized.replace(/\b\w/g, char => char.toUpperCase());
    
    return sanitized;
  }

  /**
   * Sanitize subject line
   * @param {string} subject - Subject to sanitize
   * @returns {string} - Sanitized subject
   */
  static sanitizeSubject(subject) {
    if (!subject || typeof subject !== 'string') {
      return '';
    }
    
    return this.sanitizeString(subject, {
      trim: true,
      xss: true,
      normalizeSpaces: true
    });
  }

  /**
   * Sanitize message content
   * @param {string} message - Message to sanitize
   * @returns {string} - Sanitized message
   */
  static sanitizeMessage(message) {
    if (!message || typeof message !== 'string') {
      return '';
    }
    
    let sanitized = this.sanitizeString(message, {
      trim: true,
      xss: true,
      normalizeSpaces: false // Preserve formatting in messages
    });
    
    // Remove excessive line breaks (more than 2 consecutive)
    sanitized = sanitized.replace(/\n{3,}/g, '\n\n');
    
    return sanitized;
  }

  /**
   * Sanitize IP address
   * @param {string} ip - IP address to sanitize
   * @returns {string} - Sanitized IP address
   */
  static sanitizeIP(ip) {
    if (!ip || typeof ip !== 'string') {
      return '';
    }
    
    // Remove any potential forwarded IPs, take the first one
    const cleanIP = ip.split(',')[0].trim();
    
    // Validate IP format
    if (validator.isIP(cleanIP)) {
      return cleanIP;
    }
    
    return '';
  }

  /**
   * Sanitize User Agent string
   * @param {string} userAgent - User agent to sanitize
   * @returns {string} - Sanitized user agent
   */
  static sanitizeUserAgent(userAgent) {
    if (!userAgent || typeof userAgent !== 'string') {
      return '';
    }
    
    // Limit length and remove potentially harmful content
    let sanitized = this.sanitizeString(userAgent, {
      trim: true,
      xss: true
    });
    
    // Limit length to prevent database issues
    return sanitized.substring(0, 500);
  }

  /**
   * Sanitize contact form data
   * @param {object} data - Contact form data
   * @returns {object} - Sanitized contact data
   */
  static sanitizeContactForm(data) {
    if (!data || typeof data !== 'object') {
      return {};
    }
    
    const sanitized = {};
    
    // Sanitize each field
    if (data.firstName) {
      sanitized.firstName = this.sanitizeName(data.firstName);
    }
    
    if (data.lastName) {
      sanitized.lastName = this.sanitizeName(data.lastName);
    }
    
    if (data.email) {
      sanitized.email = this.sanitizeEmail(data.email);
    }
    
    if (data.phone) {
      sanitized.phone = this.sanitizePhone(data.phone);
    }
    
    if (data.subject) {
      sanitized.subject = this.sanitizeSubject(data.subject);
    }
    
    if (data.message) {
      sanitized.message = this.sanitizeMessage(data.message);
    }
    
    if (data.ipAddress) {
      sanitized.ipAddress = this.sanitizeIP(data.ipAddress);
    }
    
    if (data.userAgent) {
      sanitized.userAgent = this.sanitizeUserAgent(data.userAgent);
    }
    
    // Handle status and priority
    if (data.status) {
      sanitized.status = this.sanitizeString(data.status, { 
        lowercase: true, 
        trim: true 
      });
    }
    
    if (data.priority) {
      sanitized.priority = this.sanitizeString(data.priority, { 
        lowercase: true, 
        trim: true 
      });
    }
    
    return sanitized;
  }

  /**
   * Remove sensitive data for logging
   * @param {object} data - Data to sanitize for logging
   * @returns {object} - Sanitized data for logging
   */
  static sanitizeForLogging(data) {
    if (!data || typeof data !== 'object') {
      return {};
    }
    
    const sanitized = { ...data };
    
    // Remove or mask sensitive fields
    if (sanitized.email) {
      const [local, domain] = sanitized.email.split('@');
      sanitized.email = `${local.substring(0, 2)}***@${domain}`;
    }
    
    if (sanitized.phone) {
      sanitized.phone = `***${sanitized.phone.slice(-4)}`;
    }
    
    if (sanitized.ipAddress) {
      const parts = sanitized.ipAddress.split('.');
      if (parts.length === 4) {
        sanitized.ipAddress = `${parts[0]}.${parts[1]}.***.***.`;
      }
    }
    
    return sanitized;
  }
}

module.exports = DataSanitizers;