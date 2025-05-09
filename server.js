const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const locationRoutes = require('./routes/locationRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const verifyRoutes = require('./routes/verifyRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));


MONGO_URI='mongodb+srv://saishyam:<sai@2345>@village-problems.5tuhmvp.mongodb.net/?retryWrites=true&w=majority&appName=village-problems'

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use('/api', locationRoutes);
app.use('/api', uploadRoutes);
app.use('/api', verifyRoutes);
// Mock in-memory DB (Replace with MongoDB or SQL in production)
const users = {}; // { phone: { phone, name } }
const problems = []; // { id, phone, text, videoUrl }

app.use(cors());
app.use(bodyParser.json());

// Mock OTP sending (simulate sending)
app.post('/api/send-otp', (req, res) => {
  const { phone } = req.body;
  users[phone] = { phone, name: `User-${phone.slice(-4)}` };
  console.log(`OTP sent to ${phone}: 123456`);
  res.send({ success: true });
});

// OTP Verification
app.post('/api/verify-otp', (req, res) => {
  const { phone, otp } = req.body;
  if (otp === '123456' && users[phone]) {
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
