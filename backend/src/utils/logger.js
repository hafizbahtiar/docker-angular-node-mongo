const winston = require('winston')
const path = require('path')

// Define log levels
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
}

// Define colors for each level
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
}

// Tell winston about the colors
winston.addColors(colors)

// Define log format
const format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.colorize({ all: true }),
    winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
)

// Define transports
const transports = [
    // Console transport
    new winston.transports.Console({
        format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),

    // File transport for errors
    new winston.transports.File({
        filename: path.join(process.cwd(), 'logs', 'error.log'),
        level: 'error',
        format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    }),

    // File transport for all logs
    new winston.transports.File({
        filename: path.join(process.cwd(), 'logs', 'combined.log'),
        format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    }),
]

// Create the logger
const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'warn',
    levels,
    format,
    transports,
    exitOnError: false,
})

// Logger utility class
class Logger {
    /**
     * Log error message
     * @param {string} message - Error message
     * @param {Error|object} error - Error object or additional data
     */
    static error(message, error = null) {
        if (error) {
            if (error instanceof Error) {
                logger.error(`${message} - ${error.message}`, {
                    stack: error.stack,
                    name: error.name,
                })
            } else {
                logger.error(message, error)
            }
        } else {
            logger.error(message)
        }
    }

    /**
     * Log warning message
     * @param {string} message - Warning message
     * @param {object} meta - Additional metadata
     */
    static warn(message, meta = {}) {
        logger.warn(message, meta)
    }

    /**
     * Log info message
     * @param {string} message - Info message
     * @param {object} meta - Additional metadata
     */
    static info(message, meta = {}) {
        logger.info(message, meta)
    }

    /**
     * Log HTTP request
     * @param {string} method - HTTP method
     * @param {string} url - Request URL
     * @param {number} statusCode - Response status code
     * @param {number} responseTime - Response time in ms
     * @param {string} ip - Client IP address
     */
    static http(method, url, statusCode, responseTime, ip) {
        logger.http(`${method} ${url} ${statusCode} ${responseTime}ms - ${ip}`)
    }

    /**
     * Log debug message (only in development)
     * @param {string} message - Debug message
     * @param {object} meta - Additional metadata
     */
    static debug(message, meta = {}) {
        if (process.env.NODE_ENV === 'development') {
            logger.debug(message, meta)
        }
    }

    /**
     * Log contact form submission
     * @param {object} contactData - Contact form data
     * @param {string} action - Action performed
     */
    static logContact(contactData, action = 'created') {
        const sanitizedData = {
            id: contactData._id,
            email: contactData.email ? `${contactData.email.substring(0, 3)}***` : 'N/A',
            subject: contactData.subject,
            status: contactData.status,
            timestamp: contactData.createdAt || new Date(),
        }

        this.info(`Contact ${action}`, sanitizedData)
    }

    /**
     * Log API request with details
     * @param {object} req - Express request object
     * @param {object} res - Express response object
     * @param {number} startTime - Request start time
     */
    static logApiRequest(req, res, startTime) {
        const duration = Date.now() - startTime
        const logData = {
            method: req.method,
            url: req.originalUrl,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip,
            userAgent: req.get('User-Agent'),
        }

        if (res.statusCode >= 400) {
            this.warn('API Request Failed', logData)
        } else {
            this.http(req.method, req.originalUrl, res.statusCode, duration, req.ip)
        }
    }

    /**
     * Log database operations
     * @param {string} operation - Database operation
     * @param {string} collection - Collection name
     * @param {object} query - Query object
     * @param {number} duration - Operation duration
     */
    static logDatabase(operation, collection, query = {}, duration = 0) {
        this.debug(`DB ${operation} on ${collection}`, {
            operation,
            collection,
            query: JSON.stringify(query),
            duration: `${duration}ms`,
        })
    }

    /**
     * Log validation errors
     * @param {string} field - Field with validation error
     * @param {string} error - Validation error message
     * @param {string} value - Value that failed validation
     */
    static logValidationError(field, error, value = '') {
        this.warn('Validation Error', {
            field,
            error,
            value: typeof value === 'string' ? value.substring(0, 50) : value,
        })
    }

    /**
     * Log spam detection
     * @param {object} spamData - Spam detection data
     */
    static logSpamDetection(spamData) {
        this.warn('Potential Spam Detected', {
            score: spamData.score,
            email: spamData.email ? `${spamData.email.substring(0, 3)}***` : 'N/A',
            subject: spamData.subject ? spamData.subject.substring(0, 50) : 'N/A',
        })
    }

    /**
     * Log system events
     * @param {string} event - System event
     * @param {object} details - Event details
     */
    static logSystem(event, details = {}) {
        this.info(`System Event: ${event}`, details)
    }
}

module.exports = Logger
