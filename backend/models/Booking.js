import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  outfitId: { type: String, required: true },
  outfitName: { type: String },
  customerName: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String },
  phone: { type: String, required: true },
  mobile: { type: String },
  deliveryLocation: { type: String },
  location: { type: String },
  selectedDates: [{ type: String }],
  rentalNights: { type: Number, default: 1 },
  size: { type: String, default: 'M' },
  paymentMethod: { type: String, default: 'trial' },
  totalRent: { type: Number, default: 0 },
  refundableDeposit: { type: Number, default: 0 },
  status: { type: String, default: 'Confirmed' },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

export const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
