// models/vendorSales.js
import mongoose from "mongoose";

// Skema Vendor
const vendorSchema = new mongoose.Schema({
  kode: {
    type: String,
    required: true,
    trim: true,
  },
  group_packet: {
    type: String,
    required: true,
    trim: true,
  },
  addon: {
    type: String,
    trim: true,
  },
  nama_vendor: {
    type: String,
    required: true,
    trim: true,
  },
  nama_sales: {
    type: String,
    required: true,
    trim: true,
  },
});

// Skema Sales
const salesSchema = new mongoose.Schema({
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true,
  },
  nama_sales: {
    type: String,
    required: true,
    trim: true,
  },
});

// Model gabungan: Vendor dan Sales
const Vendor = mongoose.model('Vendor', vendorSchema);
const Sales = mongoose.model('Sales', salesSchema);

export { Vendor, Sales };
