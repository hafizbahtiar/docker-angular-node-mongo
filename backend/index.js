'use strict'

require('dotenv').config()

// Import packages
const express = require('express')
const path = require('path')
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

// Import custom utilities
const logger = require('./src/middlewares/loggerMiddleware')
const { connectDb, healthCheck } = require('./src/config/database')

// Initialize Express app
const app = express()
const PORT = process.env.PORT || 3003

// ================================================================================
// ---------------------------- Middleware Setup ---------------------------------
// ================================================================================

// Body parsing middleware
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

// Cookie parser
app.use(cookieParser())

// CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests from multiple origins
        const allowedOrigins = [
            `http://localhost:${PORT}`,
            'http://localhost:3000', // Common React dev port
            'http://localhost:4200', // Common Angular dev port
            process.env.FRONTEND_URL,
        ].filter(Boolean) // Remove undefined values

        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true)

        if (allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true, // Allow cookies to be sent
}

app.use(cors(corsOptions))

// Custom middleware
app.use(logger)
// app.use(responseFormatter); // Temporarily disabled to isolate the issue

// ================================================================================
// ---------------------------- Static File Serving ------------------------------
// ================================================================================

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'src', 'uploads')))

// Serve static files from public directory (if exists)
app.use('/public', express.static(path.join(__dirname, 'public')))

// ================================================================================
// ---------------------------- Health Check Routes ------------------------------
// ================================================================================

// Basic health check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Server is healthy',
        data: {
            status: 'OK',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            pid: process.pid,
        },
    })
})

// Database health check
app.get('/health/db', async (req, res) => {
    try {
        const dbHealth = await healthCheck()

        if (dbHealth.status === 'healthy') {
            res.status(200).json({
                status: 'success',
                message: 'Database is healthy',
                data: dbHealth,
            })
        } else {
            res.status(503).json({
                status: 'error',
                message: 'Database is unhealthy',
                data: dbHealth,
            })
        }
    } catch (error) {
        res.status(503).json({
            status: 'error',
            message: 'Database health check failed',
            error: error.message,
        })
    }
})

// ================================================================================
// -------------------------------- API Routes ------------------------------------
// ================================================================================

// Import routes (uncomment when ready to use)
// const testingRoute = require('./src/routes/testingRoute');
// const keysRoute = require('./src/routes/keysRoute');
// const privilegesRoute = require('./src/routes/privilegesRoute');
// const usersRoute = require('./src/routes/usersRoute');

// Apply routes with API prefix
// app.use('/api/testing', testingRoute);
// app.use('/api/keys', keysRoute);
// app.use('/api/privileges', privilegesRoute);
// app.use('/api/users', usersRoute);

// Root route
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'API is running successfully',
        data: {
            message: 'Welcome to the API',
            version: '1.0.0',
            environment: process.env.NODE_ENV || 'development',
            endpoints: {
                health: '/health',
                database: '/health/db',
                api: '/api/*',
            },
        },
    })
})

// ================================================================================
// ---------------------------- Error Handling -----------------------------------
// ================================================================================

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error handler:', err)

    // CORS error
    if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({
            status: 'error',
            message: 'CORS policy violation',
            timestamp: new Date().toISOString(),
        })
    }

    // Default error response
    const statusCode = err.statusCode || err.status || 500
    const message = process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message

    res.status(statusCode).json({
        status: 'error',
        message: message,
        timestamp: new Date().toISOString(),
    })
})

// Handle 404 - Route not found (must be last)
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: `Route ${req.originalUrl} not found`,
        timestamp: new Date().toISOString(),
    })
})

// ================================================================================
// ---------------------------- Server Startup -----------------------------------
// ================================================================================

const startServer = async () => {
    try {
        // Connect to database first
        await connectDb()

        // Start the server
        const server = app.listen(PORT, () => {
            console.log(`🚀 Server listening on port ${PORT}`)
            console.log(`📍 Server URL: http://localhost:${PORT}`)
            console.log(`🔍 Health check: http://localhost:${PORT}/health`)
            console.log(`🗄️  Database health: http://localhost:${PORT}/health/db`)
            console.log(`🆔 Process ID: ${process.pid}`)
            console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
        })

        // Graceful shutdown
        const gracefulShutdown = (signal) => {
            console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`)

            server.close(async (err) => {
                if (err) {
                    console.error('❌ Error during server shutdown:', err)
                    process.exit(1)
                }

                console.log('✅ Server closed successfully')

                try {
                    // Close database connection
                    const { disconnectDb } = require('./src/config/database')
                    await disconnectDb()
                    console.log('✅ Database disconnected successfully')
                    process.exit(0)
                } catch (dbError) {
                    console.error('❌ Error disconnecting database:', dbError)
                    process.exit(1)
                }
            })
        }

        // Handle termination signals
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
        process.on('SIGINT', () => gracefulShutdown('SIGINT'))

        return server
    } catch (error) {
        console.error('❌ Failed to start server:', error)
        process.exit(1)
    }
}

// Start the server
if (require.main === module) {
    startServer()
}

module.exports = app
