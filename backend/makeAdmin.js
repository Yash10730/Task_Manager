const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./src/models/User');

const updateRole = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Find all users and print them
    const allUsers = await User.find({});
    console.log("All users in DB:");
    allUsers.forEach(u => console.log(`- ${u.email} (Role: ${u.role})`));

    // Update dixityash79@gmail.com to be admin if they exist
    const updatedUser = await User.findOneAndUpdate(
      { email: 'dixityash79@gmail.com' },
      { role: 'admin' },
      { new: true }
    );
    
    if (updatedUser) {
      console.log(`\nSuccess! Updated ${updatedUser.email} to Admin.`);
    } else {
      console.log(`\nUser dixityash79@gmail.com not found. Just making the first user an admin instead...`);
      if (allUsers.length > 0) {
        await User.findByIdAndUpdate(allUsers[0]._id, { role: 'admin' });
        console.log(`Success! Updated ${allUsers[0].email} to Admin.`);
      }
    }
    
    process.exit(0);
  } catch (err) {
    console.error("DB Error:", err);
    process.exit(1);
  }
};

updateRole();
