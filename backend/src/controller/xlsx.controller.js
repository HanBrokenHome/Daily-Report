import xlsx from "xlsx";
import fs from "fs";
import { ReportModel } from "../model/xlsx.model.js";

export const UploadXlsx = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded." });

    // Baca file XLSX
    const workbook = xlsx.readFile(file.path);
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Format key: ganti spasi ke _
    const formattedData = sheetData.map((entry) => {
      const obj = {};
      for (const key in entry) {
        const newKey = key.replace(/\s+/g, "_").toUpperCase();
        obj[newKey] = entry[key];
      }
      return obj;
    });

    // Simpan ke MongoDB
    const saved = await ReportModel.insertMany(formattedData);

    // Hapus file setelah proses
    fs.unlinkSync(file.path);

    return res.json({
      message: "Data berhasil di-upload dan disimpan.",
      total: saved.length,
      data: saved,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};
