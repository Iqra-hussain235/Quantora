import fs from "fs";
import { createRequire } from "module";
import csv from "csv-parser";
import * as XLSX from "xlsx";

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

export const parseFile = async (filePath) => {

  // ── PDF ────────────────────────────────────────────────────────────────────
  if (filePath.endsWith(".pdf")) {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  }

  // ── CSV ────────────────────────────────────────────────────────────────────
  if (filePath.endsWith(".csv")) {
    return new Promise((resolve, reject) => {
      let results = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", () => resolve(JSON.stringify(results)))
        .on("error", reject);
    });
  }

  // ── XLSX / XLS ─────────────────────────────────────────────────────────────
  if (filePath.endsWith(".xlsx") || filePath.endsWith(".xls")) {
    const workbook = XLSX.readFile(filePath);
    const allSheets = {};

    workbook.SheetNames.forEach((sheetName) => {
      const sheet = workbook.Sheets[sheetName];
      allSheets[sheetName] = XLSX.utils.sheet_to_json(sheet, { defval: "" });
    });

    return JSON.stringify(allSheets);
  }

  return "Unsupported file type";
};