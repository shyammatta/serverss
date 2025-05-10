const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const twilio = require('twilio');

require('dotenv').config();

const locationRoutes = require('./routes/locationRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const verifyRoutes = require('./routes/verifyRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.json());



MONGO_URI='mongodb+srv://saishyam:<sai@2345>@village-problems.5tuhmvp.mongodb.net/?retryWrites=true&w=majority&appName=village-problems'

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use('/api', locationRoutes);
app.use('/api', uploadRoutes);
app.use('/api', verifyRoutes);
// Mock in-memory DB (Replace with MongoDB or SQL in production)
const users = {}; // { phone: { phone, name } }
const problems = []; // { id, phone, text, videoUrl }


// Mock OTP sending (simulate sending)
const accountSid = 'AC8b87563b47a0cd0ad5deaa432df00ffa';
const authToken = '1a939f3d5fdbbf4cb63becfa02dca99b';
const client = twilio(accountSid, authToken);

app.post('/api/send-otp', async (req, res) => {
  const { phone } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Save OTP for verification later (in memory or DB)
  users[phone] = { phone, otp };

  try {
    await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: +12792639023,
      to: phone,
    });
    res.send({ success: true });
  } catch (err) {
    console.error('Twilio error:', err);
    res.status(500).send({ success: false, message: 'Failed to send OTP' });
  }
});


// OTP Verification
app.post('/api/verify-otp', (req, res) => {
  const { phone, otp } = req.body;
  if (users[phone]?.otp === otp) {
    res.send({ success: true, user: users[phone] });
  } else {
    res.send({ success: false });
  }
});

// Get problems submitted by a user
app.get('/api/my-problems/:phone', (req, res) => {
  const { phone } = req.params;
  const userProblems = problems.filter((p) => p.phone === phone);
  res.send(userProblems);
});

// Upload a problem
app.post('/api/upload-problem', (req, res) => {
  const { phone, text, videoUrl } = req.body;
  problems.push({ id: Date.now().toString(), phone, text, videoUrl });
  res.send({ success: true });
});

// Delete a problem
app.delete('/api/delete-problem/:id', (req, res) => {
  const { id } = req.params;
  const index = problems.findIndex((p) => p.id === id);
  if (index > -1) {
    problems.splice(index, 1);
    res.send({ success: true });
  } else {
    res.send({ success: false });
  }
});




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
