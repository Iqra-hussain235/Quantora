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
  }
});

// file filter (pdf, csv, doc)
const fileFilter = (req, file, cb) => {

  const allowed = ["application/pdf", "text/csv",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, CSV, DOCX allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;