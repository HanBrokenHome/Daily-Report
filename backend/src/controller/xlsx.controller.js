// controllers/vendorSalesController.js
import XLSX from "xlsx";
import mongoose from "mongoose";

// Model MongoDB
const DataSchema = new mongoose.Schema({
  group_packet: String,
  addon: String,
  nama_vendor: String,
  nama_sales: String,
  kode: String,
});

const Data = mongoose.model("Data", DataSchema);

// Convert Excel ke JSON dan simpan ke DB
export const convertExcelToJson = async (req, res) => {
  try {
    const xproFile = req.files['xpro'][0];
    const vendorFile = req.files['vendor'][0];

    const xproWorkbook = XLSX.readFile(xproFile.path);
    const vendorWorkbook = XLSX.readFile(vendorFile.path);

    const xproSheet = XLSX.utils.sheet_to_json(xproWorkbook.Sheets[xproWorkbook.SheetNames[0]]);
    const vendorSheet = XLSX.utils.sheet_to_json(vendorWorkbook.Sheets[vendorWorkbook.SheetNames[0]]);

    const result = {
      "MOJOKERTO": {}
    };

    // Memproses data dari xproSheet
    xproSheet.forEach(row => {
      if (String(row["DATEL"] || "").trim().toUpperCase() === "MOJOKERTO") {
        const kcontact = row["KCONTACT"];
        const match = typeof kcontact === "string" ? kcontact.match(/\b(M[NC]\d{4,6}|SP\d{4,6})\b/g) : null;

        if (match) {
          match.forEach(code => {
            const kode = code.trim().toUpperCase();
            const groupPacket = String(row["GROUP PAKET"] || "").toLowerCase().trim();

            if (!result["MOJOKERTO"][groupPacket]) result["MOJOKERTO"][groupPacket] = {};
            if (!result["MOJOKERTO"][groupPacket][kode]) result["MOJOKERTO"][groupPacket][kode] = {};

            result["MOJOKERTO"][groupPacket][kode]["group_packet"] = String(row["GROUP PAKET"]);
            result["MOJOKERTO"][groupPacket][kode]["addon"] = String(row["ADDON"]);
            result["MOJOKERTO"][groupPacket][kode]["nama_vendor"] = "oth vendor";
            result["MOJOKERTO"][groupPacket][kode]["nama_sales"] = "landing"; 
          });
        }
      }
    });
    // Memproses data dari vendorSheet
    vendorSheet.forEach(row => {
      const kode = String(row["Kode New"] || "").trim().toUpperCase();
      const namaVendor = String(row["Supreme / Direct"] || "").trim() || "other"; 
      const namaSales = String(row["Nama"] || "").trim() || "landing"; 

      for (const group in result["MOJOKERTO"]) {
        if (result["MOJOKERTO"][group][kode]) {
          if (!result["MOJOKERTO"][group][kode][namaVendor]) {
            result["MOJOKERTO"][group][kode][namaVendor] = [];
          }

          result["MOJOKERTO"][group][kode][namaVendor].push({
            "kode": kode,
            "group_packet": result["MOJOKERTO"][group][kode]["group_packet"],
            "addon": result["MOJOKERTO"][group][kode]["addon"],
            "nama_sales": namaSales
          });

          result["MOJOKERTO"][group][kode]["nama_vendor"] = namaVendor;
          result["MOJOKERTO"][group][kode]["nama_sales"] = namaSales;
        }
      }
    });

    // Format data dan simpan ke DB
    const formattedResult = {
      "MOJOKERTO": {}
    };

    for (const group in result["MOJOKERTO"]) {
      const groupData = result["MOJOKERTO"][group];

      for (const kode in groupData) {
        const vendorData = groupData[kode];
        const vendorName = vendorData["nama_vendor"];

        if (!formattedResult["MOJOKERTO"][group]) {
          formattedResult["MOJOKERTO"][group] = {};
        }

        if (!formattedResult["MOJOKERTO"][group][vendorName]) {
          formattedResult["MOJOKERTO"][group][vendorName] = [];
        }

        formattedResult["MOJOKERTO"][group][vendorName].push({
          "kode": kode,
          "group_packet": vendorData["group_packet"],
          "addon": vendorData["addon"],
          "nama_sales": vendorData["nama_sales"]
        });

        const data = new Data({
          group_packet: vendorData["group_packet"],
          addon: vendorData["addon"],
          nama_vendor: vendorData["nama_vendor"],
          nama_sales: vendorData["nama_sales"],
          kode: kode,
        });

        await data.save();
      }
    }

    return res.json(formattedResult);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal convert file." });
  }
};

// Ambil filter options
export const getFilterOptions = async (req, res) => {
  try {
    const group_packet = await Data.distinct("group_packet");
    const addon = await Data.distinct("addon");
    const nama_vendor = await Data.distinct("nama_vendor");
    const nama_sales = await Data.distinct("nama_sales");

    res.json({ group_packet, addon, nama_vendor, nama_sales });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal mengambil filter options." });
  }
};

// Filter data
export const filterData = async (req, res) => {
  try {
    const query = {};

    // Dinamis filter berdasarkan query
    if (req.query.group_packet) query.group_packet = req.query.group_packet;
    if (req.query.addon) query.addon = req.query.addon;
    if (req.query.nama_vendor) query.nama_vendor = req.query.nama_vendor;
    if (req.query.nama_sales) query.nama_sales = req.query.nama_sales;

    const data = await Data.find(query); // Mencari data berdasarkan query filter
    res.json(data); // Mengirimkan hasilnya
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal memfilter data." });
  }
};

export const getAllData = async (req, res) => {
  try {
    // Mengambil semua data dari koleksi Data
    const data = await Data.find();

    // Jika data ditemukan, kirim data sebagai respons
    if (data.length > 0) {
      return res.json(data);
    } else {
      return res.status(404).json({ message: "Data tidak ditemukan." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Terjadi kesalahan saat mengambil data." });
  }
};

export const getVendorGroupAddonCount = async (req, res) => {
  try {
    const allData = await Data.find();

    const allGroups = await Data.distinct("group_packet");
    const allAddons = await Data.distinct("addon");
    const allVendors = await Data.distinct("nama_vendor");

    const result = {
      "MOJOKERTO": {
        group_packet: {}, // untuk group_packet
        addon: {}          // untuk addon
      }
    };

    // Inisialisasi untuk setiap vendor, group_packet dan addon
    allVendors.forEach(vendor => {
      result["MOJOKERTO"][vendor] = {
        group_packet: {}, // untuk group_packet
        addon: {},        // untuk addon
      };

      // Set default 0 untuk setiap group dan addon
      allGroups.forEach(group => {
        result["MOJOKERTO"][vendor].group_packet[group] = 0;
      });
      allAddons.forEach(addon => {
        result["MOJOKERTO"][vendor].addon[addon] = 0;
      });
    });

    // Loop untuk menghitung jumlah untuk setiap vendor, group_packet, dan addon
    allData.forEach(row => {
      const vendor = row.nama_vendor || "other";
      const group = row.group_packet || "unknown";
      const addon = row.addon || "unknown";

      if (!result["MOJOKERTO"][vendor]) {
        result["MOJOKERTO"][vendor] = {
          group_packet: {},
          addon: {},
        };
      }

      if (!result["MOJOKERTO"][vendor].group_packet[group]) {
        result["MOJOKERTO"][vendor].group_packet[group] = 0;
      }
      if (!result["MOJOKERTO"][vendor].addon[addon]) {
        result["MOJOKERTO"][vendor].addon[addon] = 0;
      }

      result["MOJOKERTO"][vendor].group_packet[group] += 1;
      result["MOJOKERTO"][vendor].addon[addon] += 1;
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal mengambil data vendor group count." });
  }
};
