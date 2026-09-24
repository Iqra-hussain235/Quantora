import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + path.extname(file.originalname)
    );
  },
});

// Allowed MIME types: PDF, CSV, DOCX, XLSX
const ALLOWED_MIMES = [
  "application/pdf",
  "text/csv",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",       // .xlsx
  "application/vnd.ms-excel",                                                 // .xls
  "application/octet-stream",                                                 // fallback some browsers use for xlsx
];

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExts = [".pdf", ".csv", ".docx", ".xlsx", ".xls"];

  if (ALLOWED_MIMES.includes(file.mimetype) || allowedExts.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, CSV, DOCX, XLSX files are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;