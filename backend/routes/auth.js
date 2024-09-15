const express = require('express');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const mongoose = require('mongoose');
const router = express.Router();

// Model Mahasiswa
const StudentSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    biodata: {
      nama: { type: String, required: true },
      email: { type: String, required: true, unique: true }
    },
    skmPoints: { type: Number, default: 0 },
    activities: [
      {
        name: { type: String, required: true },
        type: { type: String, required: true },
        location: { type: String, required: true },
        date: { type: Date, required: true },  // Pastikan ini tipe Date
        skmPoints: { type: Number, required: true },
        status: { type: String, default: 'Pending' }
      }
    ]
  }); 

const Student = mongoose.model('Student', StudentSchema);

// Rute Sign Up
router.post('/signup', async (req, res) => {
  const { username, password, nama, email } = req.body;

  if (!username || !password || !nama || !email) {
    return res.status(400).json({ msg: 'Semua field harus diisi' });
  }

  // Cek apakah username sudah ada
  const existingStudent = await Student.findOne({ username });
  if (existingStudent) {
    return res.status(400).json({ msg: 'Username sudah terdaftar' });
  }

  // Enkripsi password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Simpan mahasiswa baru ke MongoDB
  const newStudent = new Student({
    username,
    password: hashedPassword,
    biodata: { nama, email },
    skmPoints: 0,
    activities: []
  });

  await newStudent.save();
  res.json({ msg: 'Mahasiswa berhasil terdaftar' });
});

// Rute Login Mahasiswa
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    // Validasi input
    if (!username || !password) {
      return res.status(400).json({ msg: 'Username dan password harus diisi' });
    }
  
    // Cek apakah username ada di database
    const student = await Student.findOne({ username });
    if (!student) {
      return res.status(400).json({ msg: 'Pengguna tidak ditemukan' });
    }
  
    // Cek password
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Password salah' });
    }
  
    // Jika berhasil login, kirim response
    res.json({ msg: 'Login berhasil', user: student });
  });  

// Rute untuk Upload SKM Points
router.post('/upload-skm', async (req, res) => {
    const { username, skmPoints } = req.body;
  
    // Validasi input
    if (!username || !skmPoints) {
      return res.status(400).json({ msg: 'Username dan poin SKM harus diisi' });
    }
  
    // Update poin SKM pengguna
    const student = await Student.findOne({ username });
    if (!student) {
      return res.status(400).json({ msg: 'Pengguna tidak ditemukan' });
    }
  
    // Tambah poin SKM
    student.skmPoints += parseInt(skmPoints);
    await student.save();
  
    res.json({ msg: 'Poin SKM berhasil ditambahkan' });
  });

// Rute untuk menambahkan aktivitas SKM
router.post('/add-activity', async (req, res) => {
    const { username, name, type, location, date } = req.body;
  
    // Tentukan poin berdasarkan jenis kegiatan
    const skmPointsMap = {
      organisasi: 100,
      kepanitiaan: 100,
      prestasi: 200,
      lomba: 150,
      kepersertaan: 50,
      workshop: 100,
      seminar: 50
    };
    const skmPoints = skmPointsMap[type];
  
    if (!skmPoints) {
      return res.status(400).json({ msg: 'Jenis kegiatan tidak valid' });
    }
  
    // Tambahkan aktivitas ke data mahasiswa
    const student = await Student.findOne({ username });
    if (!student) {
      return res.status(400).json({ msg: 'Pengguna tidak ditemukan' });
    }
  
    student.activities.push({
      name,
      type,
      location,
      date: new Date(date),
      skmPoints,
      status: 'Pending'
    });
  
    // Simpan dan kirimkan respons
    await student.save();
    res.json({ msg: 'Aktivitas SKM berhasil ditambahkan', activities: student.activities });
  });
  
// Rute untuk mendapatkan daftar aktivitas SKM mahasiswa
router.get('/activities/:username', async (req, res) => {
    const { username } = req.params;
  
    // Cari mahasiswa berdasarkan username
    const student = await Student.findOne({ username });
    if (!student) {
      return res.status(400).json({ msg: 'Pengguna tidak ditemukan' });
    }
  
    // Kirimkan daftar aktivitas
    res.json({ activities: student.activities });
  });


router.post('/admin/login', async (req, res) => {
    const { username, password } = req.body;
  
    // Validasi input
    if (!username || !password) {
      return res.status(400).json({ msg: 'Username dan password harus diisi' });
    }
  
    // Cek apakah admin ada di database
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(400).json({ msg: 'Admin tidak ditemukan' });
    }
  
    // Cek password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Password salah' });
    }
  
    // Jika berhasil login, kirim respons
    res.json({ msg: 'Login admin berhasil', admin });
  });

// Rute untuk mendapatkan semua SKM mahasiswa yang statusnya pending
router.get('/admin/pending-activities', async (req, res) => {
    const students = await Student.find({ 'activities.status': 'Pending' });
    
    // Ambil semua kegiatan yang statusnya pending
    const pendingActivities = students.map(student => {
      return {
        username: student.username,
        biodata: student.biodata,
        activities: student.activities.filter(activity => activity.status === 'Pending')
      };
    });
  
    res.json(pendingActivities);
  });
  
  // Rute untuk menyetujui SKM mahasiswa
router.post('/admin/approve-activity', async (req, res) => {
    const { username, activityId } = req.body;
  
    // Cari mahasiswa berdasarkan username dan update status aktivitasnya
    const student = await Student.findOne({ username });
    if (!student) {
      return res.status(400).json({ msg: 'Mahasiswa tidak ditemukan' });
    }
  
    // Update status aktivitas menjadi 'Accepted'
    const activity = student.activities.id(activityId);
    if (!activity) {
      return res.status(400).json({ msg: 'Aktivitas tidak ditemukan' });
    }
  
    activity.status = 'Accepted';
    await student.save();
  
    res.json({ msg: 'Aktivitas berhasil disetujui' });
  });
  
  
  
  

module.exports = router;