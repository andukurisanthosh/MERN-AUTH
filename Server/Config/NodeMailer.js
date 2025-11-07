const nodeMailer = require('nodemailer');

const transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,      
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});


module.exports = transporter;