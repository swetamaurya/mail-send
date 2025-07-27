# Backend Email Service

This backend receives form data and sends it to info@almustafa-medical.com using Nodemailer.

## Setup

1. Copy `.env.example` to `.env` and fill in your SMTP credentials (Gmail, Zoho, Outlook, etc).
2. Install dependencies:
   ```
   npm install
   ```
3. Start the server:
   ```
   npm start
   ```

## API Endpoint
- POST `/send-email`
  - Body: JSON with form fields (name, email, phone, message, etc)

## Example cURL
```
curl -X POST http://localhost:5000/send-email \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","phone":"1234567890","message":"Hello!"}'
``` 