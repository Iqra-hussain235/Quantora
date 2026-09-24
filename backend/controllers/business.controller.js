import Business from "../models/business.model.js";
import path from "path";
import { parseFile } from "../services/fileParser.service.js";

// ── POST /api/businesses ─────────────────────────────────────────────────────
export const createBusiness = async (req, res) => {
  try {
    console.log("REQ USER:", req.user);
    console.log("REQ BODY:", req.body);

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

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

// ── GET /api/businesses ──────────────────────────────────────────────────────
export const getUserBusinesses = async (req, res) => {
  try {
    const businesses = await Business.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    });

    res.json(businesses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── GET /api/businesses/:id ──────────────────────────────────────────────────
export const getBusinessById = async (req, res) => {
  try {
    const business = await Business.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    res.json(business);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── GET /api/businesses/:id/metrics ─────────────────────────────────────────
// Derives dashboard KPIs from the business record + any uploaded pdfDetails.
// Returns null-safe values so the dashboard shows real data when available.
export const getBusinessMetrics = async (req, res) => {
  try {
    const business = await Business.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    // Try to parse structured data from pdfDetails (uploaded Excel/CSV)
    let parsedData = null;
    if (business.pdfDetails) {
      try {
        parsedData = JSON.parse(business.pdfDetails);
      } catch (_) {
        // plain text — not structured JSON
      }
    }

    // Extract numeric metrics from parsed Excel/CSV sheets
    let revenue = null, profit = null, customers = null, churnRate = null;

    if (parsedData && typeof parsedData === "object") {
      // Iterate over all sheets looking for known column names
      const sheets = Object.values(parsedData);
      for (const rows of sheets) {
        if (!Array.isArray(rows) || rows.length === 0) continue;
        for (const row of rows) {
          const keys = Object.keys(row).map((k) => k.toLowerCase().trim());

          const findVal = (aliases) => {
            for (const alias of aliases) {
              const key = Object.keys(row).find((k) => k.toLowerCase().trim().includes(alias));
              if (key && row[key] !== "" && !isNaN(Number(String(row[key]).replace(/,/g, "")))) {
                return Number(String(row[key]).replace(/,/g, ""));
              }
            }
            return null;
          };

          if (!revenue)    revenue    = findVal(["revenue", "sales", "income", "turnover"]);
          if (!profit)     profit     = findVal(["profit", "net profit", "earnings", "net income"]);
          if (!customers)  customers  = findVal(["customer", "users", "clients", "subscribers"]);
          if (!churnRate)  churnRate  = findVal(["churn", "churn rate", "attrition"]);
        }
        if (revenue || customers) break; // found data — stop
      }
    }

    // Build a health score (0–100) from available data
    let healthScore = null;
    if (revenue !== null || customers !== null) {
      let score = 50; // base
      if (revenue  && revenue  > 0)  score += 20;
      if (profit   && profit   > 0)  score += 15;
      if (customers && customers > 0) score += 10;
      if (churnRate !== null && churnRate < 5) score += 5;
      healthScore = Math.min(score, 100);
    }

    // If no numeric data exists yet, return minimal business info
    // so dashboard shows the business name at least (not "no data")
    const metrics = {
      businessId:   business.id,
      businessName: business.businessName,
      industry:     business.industry,
      stage:        business.stage,
      description:  business.description,
      hasUploadedFile: !!business.uploadedFile,
      pdfDetails:   business.pdfDetails || null,
      // KPIs — null when no data uploaded
      revenue,
      profit,
      customers,
      churnRate,
      healthScore,
      // No chart data unless explicitly uploaded
      revenueChart: null,
      customerChart: null,
      alerts: [],
    };

    res.json(metrics);
  } catch (error) {
    console.log("METRICS ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// ── POST /api/businesses/upload ──────────────────────────────────────────────
// Uploads a file, parses it, and saves pdfDetails back to the business record.
export const uploadBusinessFile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { businessId } = req.body;
    const filePath = req.file.path; // e.g. uploads/1234567890.xlsx

    // Parse file content
    let extractedData = "";
    try {
      extractedData = await parseFile(filePath);
    } catch (parseErr) {
      console.warn("File parse warning:", parseErr.message);
    }

    // Save pdfDetails + uploadedFile to the business if businessId provided
    let updatedBusiness = null;
    if (businessId) {
      const business = await Business.findOne({
        where: { id: businessId, userId: req.user.id },
      });
      if (!business) {
        return res.status(404).json({ message: "Business not found" });
      }
      await business.update({
        pdfDetails:   extractedData || null,
        uploadedFile: req.file.filename,
      });
      updatedBusiness = business;
    }

    res.status(200).json({
      message: "File uploaded and parsed successfully",
      file: {
        originalName: req.file.originalname,
        filename:     req.file.filename,
        mimetype:     req.file.mimetype,
        size:         req.file.size,
        url:          `/uploads/${req.file.filename}`,
      },
      extractedData: extractedData || null,
      business: updatedBusiness,
      ...(businessId && { businessId }),
    });
  } catch (error) {
    console.log("UPLOAD ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// ── PUT /api/businesses/:id ──────────────────────────────────────────────────
export const updateBusiness = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    const business = await Business.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    const updatableFields = [
      "businessName", "brandName", "industry", "stage",
      "description", "targetAudience", "problemStatement",
      "solution", "uniqueValueProposition", "pdfDetails", "uploadedFile",
    ];

    const updateData = {};
    for (const field of updatableFields) {
      updateData[field] = req.body[field] ?? null;
    }
    if (!updateData.businessName) {
      return res.status(400).json({ message: "businessName is required" });
    }

    await business.update(updateData);
    res.json(business);
  } catch (error) {
    console.log("UPDATE BUSINESS ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// ── PATCH /api/businesses/:id ────────────────────────────────────────────────
export const patchBusiness = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    const business = await Business.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    const allowedFields = [
      "businessName", "brandName", "industry", "stage",
      "description", "targetAudience", "problemStatement",
      "solution", "uniqueValueProposition", "pdfDetails", "uploadedFile",
    ];

    const updateData = {};
    for (const field of allowedFields) {
      if (field in req.body) {
        updateData[field] = req.body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No valid fields provided to update" });
    }

    await business.update(updateData);
    res.json(business);
  } catch (error) {
    console.log("PATCH BUSINESS ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};


