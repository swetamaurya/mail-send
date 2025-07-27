const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post('/send-email', async (req, res) => {
  const { name, email, phone, message, ...rest } = req.body;
//   console.log('Received form data:', req.body);
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const html = `
    <h2>New Form Submission</h2>
    <table cellspacing="0" cellpadding="8" border="1" style="border-collapse: collapse; font-family: Arial, sans-serif;">
      <tr><th align="left">Name</th><td>${name || '(Not provided)'}</td></tr>
      <tr><th align="left">Email</th><td>${email || '(Not provided)'}</td></tr>
      <tr><th align="left">Phone</th><td>${phone || '(Not provided)'}</td></tr>
      <tr><th align="left">Country</th><td>${rest.country || '(Not provided)'}</td></tr>
      <tr><th align="left">City</th><td>${rest.city || '(Not provided)'}</td></tr>
      <tr><th align="left">Medical Issue</th><td>${rest.issue || '(Not provided)'}</td></tr>
      <tr><th align="left">Age / DOB</th><td>${rest.age || '(Not provided)'}</td></tr>
    </table>
  `;

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: 'swetamaurya2019@gmail.com',
      subject: 'New Form Submission',
      text: `Name: ${name || ''}\nEmail: ${email || ''}\nPhone: ${phone || ''}\nMessage: ${message || ''}\nOther: ${JSON.stringify(rest, null, 2)}`,
 html: html
    };

    // console.log('Mail options:', mailOptions);

    await transporter.sendMail(mailOptions);
    // console.log('Email sent successfully!');
    res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 