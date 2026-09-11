import Business from "../models/business.model.js";

export const createBusiness = async (req, res) => {
  try {
    const idea = req.body;
    console.log("REQ USER:", req.user);
    console.log("REQ BODY:", req.body);
    console.log("IDEA: ", idea);

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Sequelize: use userId (integer FK) instead of Mongoose's user (ObjectId)
    const business = await Business.create({
      userId: req.user.id,
      ...req.body,
    });

    res.status(201).json(business);
  } catch (error) {
    console.log("BUSINESS ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// GET USER BUSINESSES
export const getUserBusinesses = async (req, res) => {
  try {
    // Sequelize: findAll with where clause instead of Mongoose .find()
    const businesses = await Business.findAll({
      where: { userId: req.user.id },
    });

    res.json(businesses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
