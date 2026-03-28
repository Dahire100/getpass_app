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

async function seedGuard() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const email = 'guard1@example.com';
    let guard = await User.findOne({ email });

    if (guard) {
      console.log('Guard account already exists. Updating password to guard123...');
      guard.password = await bcrypt.hash('guard123', 10);
      guard.role = 'guard';
      await guard.save();
    } else {
      console.log('Creating new Guard account: guard1@example.com / guard123');
      guard = new User({
        name: 'Main Gate Guard',
        email: email,
        password: await bcrypt.hash('guard123', 10),
        role: 'guard'
      });
      await guard.save();
    }

    console.log('Guard account ready!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding guard:', err);
    process.exit(1);
  }
}

seedGuard();
