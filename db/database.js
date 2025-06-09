// config/database.js
const mongoose = require('mongoose');
const config = require('config');

const host = config.get('db.host');
const port = config.get('db.port');
const name = config.get('db.name');

// for local connection
const mongoURI = `${host}:${port}/${name}`;

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log(`✅ MongoDB connected at ${mongoURI}`);
    } catch (err) {
        console.error(`❌ MongoDB connection error: ${err.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
