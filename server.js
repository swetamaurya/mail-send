const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 7001;

app.use(cors());
app.use(express.json());

app.post('/send-email', async (req, res) => {
  const { name, email, phone, message, source, ...rest } = req.body;
  console.log('Received form data:', req.body);
  
  // Check if SMTP credentials are configured
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error('SMTP credentials not configured. Please set SMTP_USER and SMTP_PASS in .env file');
    return res.status(500).json({ 
      success: false, 
      error: 'Email service not configured. Please contact administrator.' 
    });
  }
  
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Determine email subject and content based on source
    const isVideoConsult = source === 'Video Consult Form';
    const isAutoPopup = source === 'Auto Contact Popup';
    const subject = isVideoConsult ? 'New Video Consultation Request' : isAutoPopup ? 'Auto Contact Popup Submission' : 'New Free Consultation Request';
    
    const html = `
    <p>Dear Team,</p>
    <p>You have received a new ${isVideoConsult ? 'video consultation' : isAutoPopup ? 'auto contact popup' : 'free consultation'} submission:</p>
    <ul style="font-family: Arial, sans-serif; font-size: 15px;">
      <li><b>Name:</b> ${name || '(Not provided)'}</li>
      ${isVideoConsult ? `<li><b>Contact:</b> ${email || '(Not provided)'}</li>` : `<li><b>Email:</b> ${email || '(Not provided)'}</li>`}
      ${isVideoConsult ? `<li><b>Phone:</b> ${phone || '(Not provided)'}</li>` : `<li><b>Phone:</b> ${phone || '(Not provided)'}</li>`}
      ${!isAutoPopup ? `<li><b>Country:</b> ${rest.country || '(Not provided)'}</li>` : ''}
      ${!isVideoConsult && !isAutoPopup ? `<li><b>Medical Issue:</b> ${rest.medicalIssue || '(Not provided)'}</li>` : ''}
      ${!isAutoPopup ? `<li><b>Age:</b> ${rest.age || '(Not provided)'}</li>` : ''}
      ${!isAutoPopup ? `<li><b>Gender:</b> ${rest.gender || '(Not provided)'}</li>` : ''}
      ${!isVideoConsult && !isAutoPopup ? `<li><b>Disclaimer:</b> ${rest.disclaimer || '(Not provided)'}</li>` : ''}
      ${isVideoConsult ? `<li><b>Department:</b> ${rest.department || '(Not provided)'}</li>` : ''}
      ${!isVideoConsult ? `<li><b>Message:</b> ${message || '(Not provided)'}</li>` : ''}
    </ul>
    <p>Regards,<br>Your Website</p>
  `;

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: 'swetamaurya2019@gmail.com',
      subject: subject,
      text: `Name: ${name || ''}\n${isVideoConsult ? `Contact: ${email || ''}\n` : `Email: ${email || ''}\n`}Phone: ${phone || ''}\n${!isAutoPopup ? `Country: ${rest.country || ''}\n` : ''}${!isVideoConsult && !isAutoPopup ? `Medical Issue: ${rest.medicalIssue || ''}\n` : ''}${!isAutoPopup ? `Age: ${rest.age || ''}\n` : ''}${!isAutoPopup ? `Gender: ${rest.gender || ''}\n` : ''}${!isVideoConsult && !isAutoPopup ? `Disclaimer: ${rest.disclaimer || ''}\n` : ''}${isVideoConsult ? `Department: ${rest.department || ''}\n` : ''}${!isVideoConsult ? `Message: ${message || ''}\n` : ''}${!isAutoPopup ? `Other: ${JSON.stringify(rest, null, 2)}` : ''}`,
      html: html
    };

    console.log('Mail options:', mailOptions);

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');
    res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
