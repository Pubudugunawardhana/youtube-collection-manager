const nodemailer = require('nodemailer');
const { MailtrapTransport } = require('mailtrap');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport(
    MailtrapTransport({
      token: process.env.MAILTRAP_TOKEN,
      sandbox: true,
      testInboxId: parseInt(process.env.MAILTRAP_INBOX_ID) || 4757163,
    })
  );

  const sender = {
    address: process.env.FROM_EMAIL || 'hello@example.com',
    name: process.env.FROM_NAME || 'Mailtrap Test',
  };

  const message = {
    from: sender,
    to: [options.email],
    subject: options.subject,
    text: options.message,
    html: options.html,
    category: "Integration Test",
  };

  const info = await transporter.sendMail(message);
  console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;

