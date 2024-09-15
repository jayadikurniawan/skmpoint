import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminDashboard() {
  const [pendingActivities, setPendingActivities] = useState([]);
  const [responseMessage, setResponseMessage] = useState('');

  useEffect(() => {
    // Ambil daftar aktivitas yang pending dari backend
    axios.get('http://localhost:5000/auth/admin/pending-activities')
      .then(response => {
        setPendingActivities(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handleApprove = (username, activityId) => {
    // Lakukan POST request untuk menyetujui aktivitas SKM
    axios.post('http://localhost:5000/auth/admin/approve-activity', { username, activityId })
      .then(response => {
        setResponseMessage(response.data.msg);
        setPendingActivities(prevActivities => 
          prevActivities.filter(activity => activity._id !== activityId)
        );
      })
      .catch(error => {
        setResponseMessage(error.response?.data.msg || 'Error');
      });
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      {responseMessage && <p>{responseMessage}</p>}
      <ul>
        {pendingActivities.map((student, index) => (
          <li key={index}>
            <h3>{student.biodata.nama} ({student.username})</h3>
            <ul>
              {student.activities.map((activity) => (
                <li key={activity._id}>
                  <p>Nama: {activity.name}</p>
                  <p>Jenis: {activity.type}</p>
                  <p>Lokasi: {activity.location}</p>
                  <p>Tanggal: {new Date(activity.date).toLocaleDateString()}</p>
                  <p>Poin: {activity.skmPoints}</p>
                  <p>Status: {activity.status}</p>
                  <button onClick={() => handleApprove(student.username, activity._id)}>
                    Setujui
                  </button>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminDashboard;