import fs from "fs";
import { createRequire } from "module";
import csv from "csv-parser";

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

export const parseFile = async (filePath) => {

  if (filePath.endsWith(".pdf")) {

    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);

    return data.text;
  }

  if (filePath.endsWith(".csv")) {

    return new Promise((resolve) => {

      let results = [];

      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", () => {
          resolve(JSON.stringify(results));
        });

    });
  }

  return "Unsupported file type";
};