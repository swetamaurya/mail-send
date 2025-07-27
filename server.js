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
    <p>Dear Team,</p>
    <p>You have received a new form submission:</p>
    <ul style="font-family: Arial, sans-serif; font-size: 15px;">
      <li><b>Name:</b> ${name || '(Not provided)'}</li>
      <li><b>Email:</b> ${email || '(Not provided)'}</li>
      <li><b>Phone:</b> ${phone || '(Not provided)'}</li>
      <li><b>Country:</b> ${rest.country || '(Not provided)'}</li>
      <li><b>City:</b> ${rest.city || '(Not provided)'}</li>
      <li><b>Medical Issue:</b> ${rest.issue || '(Not provided)'}</li>
      <li><b>Age / DOB:</b> ${rest.age || '(Not provided)'}</li>
    </ul>
    <p>Regards,<br>Your Website</p>
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