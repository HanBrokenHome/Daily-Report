import XLSX from "xlsx";
import fs from "fs";

export const parseExcelFile = (filePath) => {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet);

  fs.unlinkSync(filePath);
  return jsonData;
};
