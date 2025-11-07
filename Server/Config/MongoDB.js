const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        mongoose.connection.on( 'connected', () => {
            console.log( 'Mongoose connected to DB' );
        } );
        mongoose.connection.on( 'error', ( err ) => {
            console.log( 'Mongoose connection error: ' + err );
        } );
        await mongoose.connect(`${process.env.MONGODB_URL}/MERN-AUTH`);
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1);
    }
};

module.exports = connectDB;