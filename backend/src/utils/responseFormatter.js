/**
 * API Response Formatter Utility
 * Provides standardized response formatting for API endpoints
 */

/**
 * HTTP Status Codes
 */
const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
}

/**
 * Response Types
 */
const RESPONSE_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info',
}

/**
 * Base response structure
 * @param {string} status - Response status (success/error)
 * @param {string} message - Response message
 * @param {*} data - Response data
 * @param {Object} meta - Additional metadata
 * @param {Array} errors - Error details
 * @returns {Object} Formatted response object
 */
const createBaseResponse = (status, message, data = null, meta = null, errors = null) => {
    const response = {
        status,
        message,
        timestamp: new Date().toISOString(),
        ...(data !== null && { data }),
        ...(meta !== null && { meta }),
        ...(errors !== null && { errors }),
    }

    return response
}

/**
 * Success response formatter
 * @param {*} data - Response data
 * @param {string} message - Success message
 * @param {Object} meta - Additional metadata (pagination, etc.)
 * @returns {Object} Formatted success response
 */
const success = (data = null, message = 'Operation completed successfully', meta = null) => {
    return createBaseResponse(RESPONSE_TYPES.SUCCESS, message, data, meta)
}

/**
 * Created response formatter (for POST requests)
 * @param {*} data - Created resource data
 * @param {string} message - Success message
 * @param {Object} meta - Additional metadata
 * @returns {Object} Formatted created response
 */
const created = (data = null, message = 'Resource created successfully', meta = null) => {
    return createBaseResponse(RESPONSE_TYPES.SUCCESS, message, data, meta)
}

/**
 * Error response formatter
 * @param {string} message - Error message
 * @param {Array|Object} errors - Error details
 * @param {number} statusCode - HTTP status code
 * @returns {Object} Formatted error response
 */
const error = (message = 'An error occurred', errors = null, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR) => {
    const errorArray = Array.isArray(errors) ? errors : errors ? [errors] : null

    return {
        ...createBaseResponse(RESPONSE_TYPES.ERROR, message, null, null, errorArray),
        statusCode,
    }
}

/**
 * Validation error response formatter
 * @param {Array|Object} validationErrors - Validation error details
 * @param {string} message - Error message
 * @returns {Object} Formatted validation error response
 */
const validationError = (validationErrors, message = 'Validation failed') => {
    const errors = Array.isArray(validationErrors) ? validationErrors : [validationErrors]

    return {
        ...createBaseResponse(RESPONSE_TYPES.ERROR, message, null, null, errors),
        statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
    }
}

/**
 * Not found error response formatter
 * @param {string} resource - Resource name that wasn't found
 * @param {string} message - Custom error message
 * @returns {Object} Formatted not found response
 */
const notFound = (resource = 'Resource', message = null) => {
    const errorMessage = message || `${resource} not found`

    return {
        ...createBaseResponse(RESPONSE_TYPES.ERROR, errorMessage),
        statusCode: HTTP_STATUS.NOT_FOUND,
    }
}

/**
 * Unauthorized error response formatter
 * @param {string} message - Error message
 * @returns {Object} Formatted unauthorized response
 */
const unauthorized = (message = 'Authentication required') => {
    return {
        ...createBaseResponse(RESPONSE_TYPES.ERROR, message),
        statusCode: HTTP_STATUS.UNAUTHORIZED,
    }
}

/**
 * Forbidden error response formatter
 * @param {string} message - Error message
 * @returns {Object} Formatted forbidden response
 */
const forbidden = (message = 'Access denied') => {
    return {
        ...createBaseResponse(RESPONSE_TYPES.ERROR, message),
        statusCode: HTTP_STATUS.FORBIDDEN,
    }
}

/**
 * Conflict error response formatter
 * @param {string} message - Error message
 * @param {*} conflictData - Data about the conflict
 * @returns {Object} Formatted conflict response
 */
const conflict = (message = 'Resource conflict', conflictData = null) => {
    return {
        ...createBaseResponse(RESPONSE_TYPES.ERROR, message, conflictData),
        statusCode: HTTP_STATUS.CONFLICT,
    }
}

/**
 * Paginated response formatter
 * @param {Array} data - Response data array
 * @param {Object} pagination - Pagination information
 * @param {string} message - Response message
 * @returns {Object} Formatted paginated response
 */
const paginated = (data, pagination, message = 'Data retrieved successfully') => {
    const meta = {
        pagination: {
            page: pagination.page || 1,
            limit: pagination.limit || 10,
            total: pagination.total || 0,
            totalPages: Math.ceil((pagination.total || 0) / (pagination.limit || 10)),
            hasNext: pagination.hasNext || false,
            hasPrev: pagination.hasPrev || false,
        },
    }

    return createBaseResponse(RESPONSE_TYPES.SUCCESS, message, data, meta)
}

/**
 * List response formatter with optional metadata
 * @param {Array} items - Array of items
 * @param {Object} options - Additional options
 * @returns {Object} Formatted list response
 */
const list = (items, options = {}) => {
    const { message = 'Items retrieved successfully', meta = null } = options

    const responseData = {
        items: items || [],
        count: (items || []).length,
    }

    return createBaseResponse(RESPONSE_TYPES.SUCCESS, message, responseData, meta)
}

/**
 * Express.js middleware for sending formatted responses
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const middleware = (req, res, next) => {
    // Add response formatter methods to res object
    res.apiSuccess = (data, message, meta) => {
        const response = success(data, message, meta)
        return res.status(HTTP_STATUS.OK).json(response)
    }

    res.apiCreated = (data, message, meta) => {
        const response = created(data, message, meta)
        return res.status(HTTP_STATUS.CREATED).json(response)
    }

    res.apiError = (message, errors, statusCode) => {
        const response = error(message, errors, statusCode)
        return res.status(response.statusCode).json(response)
    }

    res.apiValidationError = (validationErrors, message) => {
        const response = validationError(validationErrors, message)
        return res.status(response.statusCode).json(response)
    }

    res.apiNotFound = (resource, message) => {
        const response = notFound(resource, message)
        return res.status(response.statusCode).json(response)
    }

    res.apiUnauthorized = (message) => {
        const response = unauthorized(message)
        return res.status(response.statusCode).json(response)
    }

    res.apiForbidden = (message) => {
        const response = forbidden(message)
        return res.status(response.statusCode).json(response)
    }

    res.apiConflict = (message, conflictData) => {
        const response = conflict(message, conflictData)
        return res.status(response.statusCode).json(response)
    }

    res.apiPaginated = (data, pagination, message) => {
        const response = paginated(data, pagination, message)
        return res.status(HTTP_STATUS.OK).json(response)
    }

    res.apiList = (items, options) => {
        const response = list(items, options)
        return res.status(HTTP_STATUS.OK).json(response)
    }

    next()
}

/**
 * Format error for logging
 * @param {Error} err - Error object
 * @returns {Object} Formatted error for logging
 */
const formatErrorForLogging = (err) => {
    return {
        message: err.message,
        stack: err.stack,
        name: err.name,
        timestamp: new Date().toISOString(),
        ...(err.statusCode && { statusCode: err.statusCode }),
        ...(err.code && { code: err.code }),
    }
}

/**
 * Handle async errors in Express routes
 * @param {Function} fn - Async function
 * @returns {Function} Express middleware function
 */
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next)
    }
}

module.exports = {
    // Response formatters
    success,
    created,
    error,
    validationError,
    notFound,
    unauthorized,
    forbidden,
    conflict,
    paginated,
    list,

    // Middleware
    middleware,
    asyncHandler,

    // Utilities
    formatErrorForLogging,

    // Constants
    HTTP_STATUS,
    RESPONSE_TYPES,
}
