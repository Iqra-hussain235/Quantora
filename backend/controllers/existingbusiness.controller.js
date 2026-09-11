import ExistingBusiness from "../models/existingbusiness.model.js";
import { parseFile } from "../services/fileParser.service.js";

export const createExistingBusiness = async (req, res) => {
  try {
    let extractedData = "";

    if (req.file) {
      const filePath = `uploads/${req.file.filename}`;
      extractedData = await parseFile(filePath);
    }

    // Sequelize: FK field is 'userId' (integer), not Mongoose 'user' (ObjectId)
    const business = await ExistingBusiness.create({
      userId: req.user.id,
      ...req.body,
      file: req.file?.filename,
      extractedData, // AI raw data
    });

    res.status(201).json({
      business,
      extractedData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};