const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./src/models/User');

const makeAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const users = await User.find({});
    console.log('All users:', users.map(u => u.email));
    
    // Just make the first user an admin
    if (users.length > 0) {
      const user = await User.findByIdAndUpdate(users[0]._id, { role: 'admin' }, { new: true });
      console.log('Made user admin:', user.email);
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

makeAdmin();
