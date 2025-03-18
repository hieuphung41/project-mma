import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User Name is required'],
    trim: true,
    minLength: 2,
    maxLength: 50,
  },
  email: {
    type: String,
    required: [true, 'User Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'Please fill a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'User Password is required'],
    minLength: 6,
  },
  role:{
    type: String,
    enum: ['user', 'admin', 'sale-staff'],
    default: 'user'
  },
  phone: {
    type: String,
    required: [true, 'User Phone is required'],
    trim: true,
    unique: true,
    match: [/^\+?\d{1,15}$/, 'Please fill a valid phone number'],
  },
  isVerified: { type: Boolean, default: false }, 
  verificationCode: String, 
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;