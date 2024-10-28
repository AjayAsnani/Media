const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  streetAddress: { type: String, required: true },
  town: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, lowercase: true }, 
  nomineeName: { type: String, required: true },
  vigilanceOfficer: { type: String, required: true },
  accountUsername: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  userImage: { type: String },
  aadharFront: { type: String },
  aadharBack: { type: String },
  panCard: { type: String },
  bankPassbook: { type: String },
  paymentScreenshot: { type: String },
  registrationDate: { type: Date, required: true },
  role: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user',
    required: true 
  },
  status: { type: String, default: 'Pending' },
  lastWithdrawal: { type: String },
  currentBalance: { type: Number, default: 0 },
  referredBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  referPhoneNumber: { type: String }, // Updated field for refer phone number
  totalIncome : { type:Number, default:0 },
  totalRefers : { type:Number, default:0 }
});

// Create a User model
const User = mongoose.model('User', userSchema);

module.exports = User;