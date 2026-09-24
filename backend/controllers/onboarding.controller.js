import Business from "../models/business.model.js";
import BusinessLocation from "../models/businessLocation.model.js";
import BusinessSalesChannel from "../models/businessSalesChannel.model.js";
import BusinessPosSystem from "../models/businessPosSystem.model.js";
import FinancialHistory from "../models/financialHistory.model.js";
import { BusinessCompliance } from "../models/onlineOrder.model.js";


// ── Helper: ensure business belongs to user ───────────────────
const getBiz = async (id, userId) => {
  const biz = await Business.findOne({ where: { id, userId } });
  return biz;
};

// ── STEP 1: Save basic business details ──────────────────────
// POST /api/onboarding/start
export const startOnboarding = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const {
      businessName, industry, businessType, businessModel, stage,
      country, state, city, pincode, website, description, currency,
      employeeCount, brandName,
    } = req.body;

    if (!businessName) return res.status(400).json({ message: "businessName is required" });

    const business = await Business.create({
      userId: req.user.id,
      businessName,
      industry,
      businessType,
      businessModel,
      stage:         stage || "Early Revenue",
      country,
      state,
      city,
      pincode,
      website,
      description,
      currency:      currency || "USD",
      employeeCount,
      brandName,
      onboardingStep: 1,
      onboardingDone: false,
      isDemo:         false,
    });

    res.status(201).json({ message: "Business created", business });
  } catch (err) {
    console.error("startOnboarding error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// ── STEP 2: Save operating model ──────────────────────────────
// PATCH /api/onboarding/:businessId/operating-model
export const saveOperatingModel = async (req, res) => {
  try {
    const biz = await getBiz(req.params.businessId, req.user.id);
    if (!biz) return res.status(404).json({ message: "Business not found" });

    const { operatingModel } = req.body;
    if (!operatingModel) return res.status(400).json({ message: "operatingModel is required" });

    await biz.update({ operatingModel, onboardingStep: 2 });
    res.json({ message: "Operating model saved", business: biz });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── STEP 3: Save sales channels ───────────────────────────────
// POST /api/onboarding/:businessId/channels
export const saveSalesChannels = async (req, res) => {
  try {
    const biz = await getBiz(req.params.businessId, req.user.id);
    if (!biz) return res.status(404).json({ message: "Business not found" });

    const { channels } = req.body;
    // channels: [{ channelType, platformName, platformUrl }]
    if (!Array.isArray(channels) || channels.length === 0) {
      return res.status(400).json({ message: "channels array is required" });
    }

    // Delete existing and recreate
    await BusinessSalesChannel.destroy({ where: { businessId: biz.id } });
    const created = await BusinessSalesChannel.bulkCreate(
      channels.map((c) => ({ ...c, businessId: biz.id }))
    );

    await biz.update({ onboardingStep: 3 });
    res.json({ message: "Channels saved", channels: created });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── STEP 4: Save store locations ──────────────────────────────
// POST /api/onboarding/:businessId/locations
export const saveLocations = async (req, res) => {
  try {
    const biz = await getBiz(req.params.businessId, req.user.id);
    if (!biz) return res.status(404).json({ message: "Business not found" });

    const { locations } = req.body;
    if (!Array.isArray(locations) || locations.length === 0) {
      return res.status(400).json({ message: "locations array is required" });
    }

    await BusinessLocation.destroy({ where: { businessId: biz.id } });
    const created = await BusinessLocation.bulkCreate(
      locations.map((l) => ({ ...l, businessId: biz.id }))
    );

    await biz.update({ onboardingStep: 4 });
    res.json({ message: "Locations saved", locations: created });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── STEP 5: Save POS / billing info ──────────────────────────
// POST /api/onboarding/:businessId/pos
export const savePosSystem = async (req, res) => {
  try {
    const biz = await getBiz(req.params.businessId, req.user.id);
    if (!biz) return res.status(404).json({ message: "Business not found" });

    const { provider, billingSoftware, terminalCount, canExportSales, canExportInventory } = req.body;

    await BusinessPosSystem.destroy({ where: { businessId: biz.id } });
    const pos = await BusinessPosSystem.create({
      businessId: biz.id,
      provider,
      billingSoftware,
      terminalCount,
      canExportSales:     !!canExportSales,
      canExportInventory: !!canExportInventory,
    });

    await biz.update({ onboardingStep: 5 });
    res.json({ message: "POS system saved", pos });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── STEP 6: Save financial history (manual rows) ──────────────
// POST /api/onboarding/:businessId/financial-history
export const saveFinancialHistory = async (req, res) => {
  try {
    const biz = await getBiz(req.params.businessId, req.user.id);
    if (!biz) return res.status(404).json({ message: "Business not found" });

    const { records } = req.body;
    // records: [{ periodStart, periodEnd, periodType, revenue, cogs, grossProfit, operatingExpenses, marketingSpend, netProfit }]
    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ message: "records array is required" });
    }

    await FinancialHistory.destroy({ where: { businessId: biz.id } });
    const created = await FinancialHistory.bulkCreate(
      records.map((r) => ({ ...r, businessId: biz.id }))
    );

    await biz.update({ onboardingStep: 6 });
    res.json({ message: "Financial history saved", records: created });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── STEP 7: Save compliance info ──────────────────────────────
// POST /api/onboarding/:businessId/compliance
export const saveCompliance = async (req, res) => {
  try {
    const biz = await getBiz(req.params.businessId, req.user.id);
    if (!biz) return res.status(404).json({ message: "Business not found" });

    const [compliance] = await BusinessCompliance.upsert({
      businessId:               biz.id,
      ...req.body,
    });

    await biz.update({ onboardingStep: 7 });
    res.json({ message: "Compliance saved", compliance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── STEP 8: Confirm & complete onboarding ─────────────────────
// POST /api/onboarding/:businessId/confirm
export const confirmOnboarding = async (req, res) => {
  try {
    const biz = await getBiz(req.params.businessId, req.user.id);
    if (!biz) return res.status(404).json({ message: "Business not found" });

    await biz.update({ onboardingDone: true, onboardingStep: 99 });

    res.json({
      message: "Onboarding complete!",
      business: biz,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── GET: Full onboarding summary for review screen ────────────
// GET /api/onboarding/:businessId/summary
export const getOnboardingSummary = async (req, res) => {
  try {
    const biz = await getBiz(req.params.businessId, req.user.id);
    if (!biz) return res.status(404).json({ message: "Business not found" });

    const [locations, channels, pos, compliance, financial] = await Promise.all([
      BusinessLocation.findAll({ where: { businessId: biz.id } }),
      BusinessSalesChannel.findAll({ where: { businessId: biz.id } }),
      BusinessPosSystem.findAll({ where: { businessId: biz.id } }),
      BusinessCompliance.findOne({ where: { businessId: biz.id } }),
      FinancialHistory.findAll({ where: { businessId: biz.id }, order: [["periodStart", "ASC"]] }),
    ]);

    res.json({
      business:   biz,
      locations,
      channels,
      pos,
      compliance,
      financial,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
