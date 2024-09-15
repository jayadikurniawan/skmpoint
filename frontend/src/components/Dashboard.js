import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard({ user }) {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    location: '',
    date: ''
  });
  const [activities, setActivities] = useState([]);
  const [responseMessage, setResponseMessage] = useState('');

  // Ambil daftar aktivitas mahasiswa
  useEffect(() => {
    axios.get(`http://localhost:5000/auth/activities/${user.username}`)
      .then(response => {
        setActivities(response.data.activities);
      })
      .catch(error => {
        console.error(error);
      });
  }, [user.username]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Kirim data form ke backend untuk menambahkan aktivitas SKM
    axios.post('http://localhost:5000/auth/add-activity', {
      ...formData,
      username: user.username
    })
    .then(response => {
      setResponseMessage(response.data.msg);
      setActivities(response.data.activities);
    })
    .catch(error => {
      setResponseMessage(error.response?.data.msg || 'Error');
    });
  };

  return (
    <div>
      <h2>Dashboard {user.biodata.nama}</h2>

      <h3>Tambah Aktivitas SKM</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Nama Kegiatan"
          onChange={handleChange}
          required
        />
        <select name="type" onChange={handleChange} required>
          <option value="">Pilih Jenis Kegiatan</option>
          <option value="organisasi">Organisasi</option>
          <option value="kepanitiaan">Kepanitiaan</option>
          <option value="prestasi">Prestasi</option>
          <option value="lomba">Lomba</option>
          <option value="kepersertaan">Kepersertaan</option>
          <option value="workshop">Workshop</option>
          <option value="seminar">Seminar</option>
        </select>
        <input
          type="text"
          name="location"
          placeholder="Lokasi Kegiatan"
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="date"
          onChange={handleChange}
          required
        />
        <button type="submit">Tambah Aktivitas</button>
      </form>
      {responseMessage && <p>{responseMessage}</p>}

      <h3>Daftar Aktivitas SKM</h3>
      <ul>
        {activities.map((activity, index) => (
          <li key={index}>
            <p>Nama: {activity.name}</p>
            <p>Jenis: {activity.type}</p>
            <p>Lokasi: {activity.location}</p>
            <p>Tanggal: {new Date(activity.date).toLocaleDateString()}</p>
            <p>Poin: {activity.skmPoints}</p>
            <p>Status: {activity.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;