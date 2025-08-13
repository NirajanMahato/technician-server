const nodemailer = require("nodemailer");
const env = require("../config/env_config");

const transporter = nodemailer.createTransport({
  host: env.EMAIL_HOST, // e.g. smtp.gmail.com
  port: Number(env.EMAIL_PORT) || 587, // 587 for STARTTLS, 465 for SMTPS
  secure: Number(env.EMAIL_PORT) === 465, // true if port 465
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
  },
});

transporter.verify().catch((err) => {
  console.error("Email transporter verification failed:", err.message);
});

async function sendMail({ to, subject, html, text }) {
  const mailOptions = {
    from: `"Technician Booking" <${env.EMAIL_USER}>`,
    to,
    subject,
    html,
    ...(text ? { text } : {}),
  };
  return transporter.sendMail(mailOptions);
}

module.exports = { sendMail };
