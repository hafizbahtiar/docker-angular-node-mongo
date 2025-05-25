/**
 * Database Configuration Module
 * Handles MongoDB connection with proper error handling and configuration
 */

'use strict'

require('dotenv').config()
const mongoose = require('mongoose')

// Configure Mongoose settings
mongoose.set('strictQuery', true) // Enable strict query mode for Mongoose

/**
 * Database configuration options
 */
const dbConfig = {
    uri: process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/myappangular',
    options: {
        // Connection options for better performance and reliability
        maxPoolSize: 10, // Maintain up to 10 socket connections
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close connections after 45 seconds of inactivity
        // Note: bufferCommands and bufferMaxEntries are deprecated in newer Mongoose versions
        // useNewUrlParser and useUnifiedTopology are default in Mongoose 6+
    },
}

/**
 * Connect to MongoDB database
 * @returns {Promise<void>}
 */
const connectDb = async () => {
    try {
        // Set up connection event listeners
        mongoose.connection.on('connected', () => {
            console.log('✅ MongoDB connected successfully')
            console.log(`📍 Connected to: ${dbConfig.uri.replace(/\/\/.*@/, '//***:***@')}`) // Hide credentials in logs
        })

        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err)
        })

        mongoose.connection.on('disconnected', () => {
            console.log('🔌 MongoDB disconnected')
        })

        // Handle application termination
        process.on('SIGINT', async () => {
            try {
                await mongoose.connection.close()
                console.log('🔒 MongoDB connection closed through app termination')
                process.exit(0)
            } catch (error) {
                console.error('Error closing MongoDB connection:', error)
                process.exit(1)
            }
        })

        // Connect to MongoDB
        await mongoose.connect(dbConfig.uri, dbConfig.options)
    } catch (error) {
        console.error('❌ Failed to connect to MongoDB:', error.message)

        // In development, log the full error
        if (process.env.NODE_ENV === 'development') {
            console.error('Full error details:', error)
        }

        // Exit the process with failure
        process.exit(1)
    }
}

/**
 * Disconnect from MongoDB database
 * @returns {Promise<void>}
 */
const disconnectDb = async () => {
    try {
        await mongoose.connection.close()
        console.log('🔒 MongoDB connection closed')
    } catch (error) {
        console.error('❌ Error closing MongoDB connection:', error)
        throw error
    }
}

/**
 * Check database connection status
 * @returns {boolean} Connection status
 */
const isConnected = () => {
    return mongoose.connection.readyState === 1
}

/**
 * Get database connection state
 * @returns {string} Connection state description
 */
const getConnectionState = () => {
    const states = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting',
        99: 'uninitialized',
    }

    return states[mongoose.connection.readyState] || 'unknown'
}

/**
 * Database health check
 * @returns {Promise<Object>} Health check result
 */
const healthCheck = async () => {
    try {
        const state = getConnectionState()
        const isHealthy = isConnected()

        if (isHealthy) {
            // Perform a simple database operation to verify connectivity
            await mongoose.connection.db.admin().ping()
        }

        return {
            status: isHealthy ? 'healthy' : 'unhealthy',
            state,
            timestamp: new Date().toISOString(),
            database: mongoose.connection.name || 'unknown',
        }
    } catch (error) {
        return {
            status: 'unhealthy',
            state: getConnectionState(),
            error: error.message,
            timestamp: new Date().toISOString(),
        }
    }
}

/**
 * Middleware for checking database connection
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const ensureDbConnection = (req, res, next) => {
    if (!isConnected()) {
        return res.status(503).json({
            status: 'error',
            message: 'Database connection unavailable',
            timestamp: new Date().toISOString(),
        })
    }
    next()
}

// Export the mongoose instance and utility functions
module.exports = {
    // Main functions
    connectDb,
    disconnectDb,

    // Utility functions
    isConnected,
    getConnectionState,
    healthCheck,
    ensureDbConnection,

    // Mongoose instance
    mongoose,

    // Configuration (for testing or debugging)
    dbConfig: {
        ...dbConfig,
        uri: dbConfig.uri.replace(/\/\/.*@/, '//***:***@'), // Hide credentials
    },
}
