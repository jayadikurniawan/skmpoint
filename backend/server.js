const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const authRoutes = require('./routes/auth');

// Middleware untuk parsing JSON
app.use(express.json());
app.use(cors()); // Untuk mengizinkan komunikasi antara frontend dan backend

// Koneksi ke MongoDB
mongoose.connect('mongodb://localhost:27017/skm-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Rute
app.use('/auth', authRoutes);

// Jalankan server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});