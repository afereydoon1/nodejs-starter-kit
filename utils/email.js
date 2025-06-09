// src/utils/email.js
const nodemailer = require('nodemailer');
const config = require('config');

const transporter = nodemailer.createTransport({
  host: config.get('email.host'),
  port: config.get('email.port'),
  auth: {
    user: config.get('email.user'),
    pass: config.get('email.pass')
  }
});

exports.sendMail = (to, subject, text) => {
  return transporter.sendMail({
    from: config.get('email.from'),
    to,
    subject,
    text
  });
};