const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: './.env' });

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin', 'guard', 'visitor', 'faculty'], default: 'student' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

const testUsers = [
  { name: 'System Admin', email: 'admin1@example.com', password: 'admin123', role: 'admin' },
  { name: 'John Student', email: 'student1@example.com', password: 'student123', role: 'student' },
  { name: 'Main Gate Guard', email: 'guard1@example.com', password: 'guard123', role: 'guard' },
  { name: 'Guest Visitor', email: 'visitor1@example.com', password: 'visitor123', role: 'visitor' },
];

async function seedAll() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    for (const data of testUsers) {
      let user = await User.findOne({ email: data.email });
      const hashedPassword = await bcrypt.hash(data.password, 10);

      if (user) {
        console.log(`Updating ${data.role}: ${data.email}`);
        user.password = hashedPassword;
        user.role = data.role;
        user.name = data.name;
        await user.save();
      } else {
        console.log(`Creating ${data.role}: ${data.email}`);
        user = new User({
          name: data.name,
          email: data.email,
          password: hashedPassword,
          role: data.role
        });
        await user.save();
      }
    }

    console.log('All test accounts are ready as per logins.md!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
}

seedAll();
