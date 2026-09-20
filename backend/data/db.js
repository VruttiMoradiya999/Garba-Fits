import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { Booking } from '../models/Booking.js';
import { Inquiry } from '../models/Inquiry.js';
import { Subscriber } from '../models/Subscriber.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'bookings.json');

// Initialize local JSON backup file
function initDb() {
  if (!fs.existsSync(DATA_FILE)) {
    const initialData = {
      bookings: [],
      inquiries: [],
      subscribers: []
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  }
}

initDb();

function readLocalData() {
  try {
    initDb();
    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    return { bookings: [], inquiries: [], subscribers: [] };
  }
}

function writeLocalData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    return false;
  }
}

// Connect to MongoDB
export async function connectMongoDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('[Database] MONGODB_URI not found in .env, using local JSON storage.');
    return;
  }

  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(uri);
      console.log('[Database] ✓ Connected to MongoDB Atlas successfully!');
    }
  } catch (err) {
    console.error('[Database Error] Failed to connect to MongoDB Atlas:', err.message);
  }
}

export const db = {
  getBookings: async () => {
    try {
      if (mongoose.connection.readyState === 1) {
        const docs = await Booking.find().sort({ createdAt: -1 }).lean();
        return docs;
      }
    } catch (err) {
      console.warn('[Database Warning] MongoDB fetch failed, using local backup:', err.message);
    }
    return readLocalData().bookings || [];
  },
  
  saveBooking: async (booking) => {
    // 1. Save to MongoDB Atlas
    try {
      if (mongoose.connection.readyState === 1) {
        const newDoc = await Booking.create(booking);
        console.log(`[Database] ✓ Saved booking ${booking.id} (${booking.customerName}) to MongoDB Atlas!`);
      }
    } catch (err) {
      console.error('[Database Error] Failed saving to MongoDB Atlas:', err.message);
    }

    // 2. Save to local JSON backup
    const data = readLocalData();
    data.bookings = data.bookings || [];
    data.bookings.unshift(booking);
    writeLocalData(data);

    return booking;
  },

  getInquiries: async () => {
    try {
      if (mongoose.connection.readyState === 1) {
        return await Inquiry.find().sort({ createdAt: -1 }).lean();
      }
    } catch (err) {}
    return readLocalData().inquiries || [];
  },

  saveInquiry: async (inquiry) => {
    try {
      if (mongoose.connection.readyState === 1) {
        await Inquiry.create(inquiry);
        console.log(`[Database] ✓ Saved inquiry ${inquiry.id} to MongoDB Atlas!`);
      }
    } catch (err) {}

    const data = readLocalData();
    data.inquiries = data.inquiries || [];
    data.inquiries.unshift(inquiry);
    writeLocalData(data);
    return inquiry;
  },

  saveSubscriber: async (email) => {
    try {
      if (mongoose.connection.readyState === 1) {
        await Subscriber.findOneAndUpdate(
          { email },
          { email },
          { upsert: true, new: true }
        );
        console.log(`[Database] ✓ Saved subscriber ${email} to MongoDB Atlas!`);
      }
    } catch (err) {}

    const data = readLocalData();
    data.subscribers = data.subscribers || [];
    if (!data.subscribers.includes(email)) {
      data.subscribers.push(email);
      writeLocalData(data);
    }
    return email;
  }
};
