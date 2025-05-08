import { parseExcelFile } from "../utils/excelParser.js";

export const parseReport = async (filePath) => {
  return parseExcelFile(filePath);
};
