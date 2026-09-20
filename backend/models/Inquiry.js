import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String, required: true },
  city: { type: String },
  message: { type: String },
  preferredDate: { type: String },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

export const Inquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', inquirySchema);
