// logger.js

const pino = require('pino');
const fs = require('fs');
const path = require('path');

// Try to initialize MongoDB transport
let mongoTransport;
try {
    mongoTransport = pino.transport({
        target: 'pino-mongodb',
        options: {
            uri: process.env.DB_HOST, 
            database: process.env.DB_NAME,  
            collection: 'logs',             
        }
    });
    console.log("MongoDB transport initialized");
} catch (error) {
    console.error("Failed to initialize MongoDB transport. Logs will not be saved to MongoDB.", error);
    mongoTransport = null;
}

// Create logs directory if it does not exist
const logDirectory = path.join(__dirname, 'logs');
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

// Create console transport with pretty formatting
const prettyTransport = pino.transport({
    target: 'pino-pretty',
    options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
    },
});

// Create file write stream for log file
const logFileStream = fs.createWriteStream(path.join(logDirectory, 'app.log'), { flags: 'a' });

// Prepare an array of streams
const streams = [
    { stream: prettyTransport },
    { stream: logFileStream }, 
];

// Add MongoDB stream if available
if (mongoTransport) {
    streams.push({ stream: mongoTransport });
}

// Create the final logger instance
const logger = pino({
    level: 'debug',
}, pino.multistream(streams));

module.exports = logger;