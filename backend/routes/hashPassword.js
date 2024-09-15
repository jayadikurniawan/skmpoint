const bcrypt = require('bcryptjs');

const plainPassword = 'xxx'; // Ganti dengan password admin yang ingin di-hash

bcrypt.hash(plainPassword, 10, (err, hash) => {
  if (err) throw err;
  console.log('Hashed password:', hash);
});