'use strict'

const logger = async (req, res, next) => {
    console.log(`Incoming ${req.method} request to ${req.url}`)
    next()
}

module.exports = logger
