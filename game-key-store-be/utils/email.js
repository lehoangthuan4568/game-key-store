// utils/email.js
const nodemailer = require('nodemailer');

const sendEmail = async options => {
    // 1) Tạo một transporter (dịch vụ sẽ gửi email, ví dụ: Gmail)
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    // 2) Định nghĩa các tùy chọn cho email
    const mailOptions = {
        from: 'Game Key Store <no-reply@gamekeystore.com>',
        to: options.email,
        subject: options.subject,
        html: options.html,
    };

    // 3) Gửi email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;