"use client";
import { useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { useBusiness } from "@/context/BusinessContext";
import API from "@/config/api";
import {
  Sparkles, ArrowRight, Building2, Zap, Play, Check, ChevronRight,
  UploadCloud, X, AlertCircle, Plus, Trash2, ArrowLeft, Store,
  Globe, ShoppingCart, Package, DollarSign, FileText, ClipboardCheck,
  Eye, CheckCircle2,
} from "lucide-react";

// ════════════════════════════════════════════════════════════
// CONSTANTS
// ════════════════════════════════════════════════════════════
const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia", "Australia",
  "Austria", "Azerbaijan", "Bahrain", "Bangladesh", "Belarus", "Belgium", "Bolivia", "Bosnia",
  "Brazil", "Bulgaria", "Cambodia", "Canada", "Chile", "China", "Colombia", "Croatia", "Cuba",
  "Cyprus", "Czech Republic", "Denmark", "Ecuador", "Egypt", "Estonia", "Ethiopia", "Finland",
  "France", "Georgia", "Germany", "Ghana", "Greece", "Guatemala", "Hungary", "India", "Indonesia",
  "Iran", "Iraq", "Ireland", "Israel", "Italy", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kuwait",
  "Latvia", "Lebanon", "Libya", "Lithuania", "Luxembourg", "Malaysia", "Mexico", "Moldova",
  "Mongolia", "Morocco", "Myanmar", "Nepal", "Netherlands", "New Zealand", "Nigeria", "Norway",
  "Oman", "Pakistan", "Palestine", "Panama", "Peru", "Philippines", "Poland", "Portugal", "Qatar",
  "Romania", "Russia", "Saudi Arabia", "Senegal", "Serbia", "Singapore", "Slovakia", "South Africa",
  "South Korea", "Spain", "Sri Lanka", "Sudan", "Sweden", "Switzerland", "Syria", "Taiwan",
  "Tanzania", "Thailand", "Tunisia", "Turkey", "UAE", "Uganda", "Ukraine", "United Kingdom",
  "United States", "Uruguay", "Uzbekistan", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe",
];

const INDUSTRIES = [
  "Agriculture & Farming", "Automotive", "Aviation & Aerospace", "Beauty & Personal Care",
  "Biotechnology", "Construction & Real Estate", "Consulting", "Consumer Electronics",
  "E-commerce & Online Retail", "Education & Ed-Tech", "Energy & Utilities",
  "Entertainment & Media", "Fashion & Apparel", "Finance & Banking", "Food & Beverage",
  "Gaming", "Grocery & Supermarket", "Healthcare & Medical", "Hospitality & Tourism",
  "Logistics & Supply Chain", "Manufacturing", "Marketing & Advertising", "NGO & Non-profit",
  "Pharmaceuticals", "Property & Real Estate", "Retail", "Restaurant & Food Service",
  "SaaS & Software", "Staffing & Outsourcing", "Telecommunications", "Transportation",
  "Travel", "Wholesale & Distribution", "Other",
];

const BUSINESS_TYPES = [
  { id: "ecommerce",     label: "E-commerce / Online Retailer",  icon: "🛔" },
  { id: "grocery",      label: "Grocery / Supermarket / Mart",   icon: "🛒" },
  { id: "grocery_online",label: "Grocery + Online",              icon: "🏪" },
  { id: "retail",       label: "Retail Store",                   icon: "🏬" },
  { id: "saas",         label: "SaaS / Software",                icon: "💻" },
  { id: "restaurant",   label: "Restaurant / Food Service",      icon: "🍽️" },
  { id: "manufacturing",label: "Manufacturing",                  icon: "🏭" },
  { id: "services",     label: "Services / Consulting",          icon: "🤝" },
  { id: "marketplace",  label: "Marketplace / Platform",         icon: "🔗" },
  { id: "other",        label: "Other",                          icon: "✨" },
];

// Industry → relevant business type IDs (dynamic filtering)
const INDUSTRY_TO_BUSINESS_TYPES = {
  "E-commerce & Online Retail":    ["ecommerce", "marketplace", "retail", "other"],
  "Grocery & Supermarket":         ["grocery", "grocery_online", "retail", "other"],
  "Food & Beverage":               ["restaurant", "grocery", "grocery_online", "retail", "ecommerce", "manufacturing", "other"],
  "Restaurant & Food Service":     ["restaurant", "other"],
  "SaaS & Software":               ["saas", "marketplace", "other"],
  "Retail":                        ["retail", "ecommerce", "grocery", "marketplace", "other"],
  "Manufacturing":                 ["manufacturing", "other"],
  "Fashion & Apparel":             ["ecommerce", "retail", "marketplace", "manufacturing", "other"],
  "Healthcare & Medical":          ["services", "saas", "ecommerce", "other"],
  "Hospitality & Tourism":         ["services", "marketplace", "other"],
  "Consulting":                    ["services", "other"],
  "Marketing & Advertising":       ["services", "saas", "other"],
  "Finance & Banking":             ["services", "saas", "other"],
  "Education & Ed-Tech":           ["saas", "services", "marketplace", "ecommerce", "other"],
  "Gaming":                        ["saas", "marketplace", "other"],
  "Telecommunications":            ["services", "saas", "other"],
  "Logistics & Supply Chain":      ["services", "manufacturing", "marketplace", "other"],
  "Agriculture & Farming":         ["manufacturing", "retail", "ecommerce", "other"],
  "Automotive":                    ["retail", "services", "manufacturing", "ecommerce", "other"],
  "Aviation & Aerospace":          ["manufacturing", "services", "other"],
  "Beauty & Personal Care":        ["ecommerce", "retail", "services", "marketplace", "other"],
  "Biotechnology":                 ["manufacturing", "saas", "services", "other"],
  "Construction & Real Estate":    ["services", "marketplace", "other"],
  "Consumer Electronics":          ["ecommerce", "retail", "manufacturing", "marketplace", "other"],
  "Energy & Utilities":            ["services", "manufacturing", "other"],
  "Entertainment & Media":         ["saas", "marketplace", "services", "ecommerce", "other"],
  "NGO & Non-profit":              ["services", "other"],
  "Pharmaceuticals":               ["manufacturing", "ecommerce", "services", "other"],
  "Property & Real Estate":        ["services", "marketplace", "other"],
  "Staffing & Outsourcing":        ["services", "saas", "other"],
  "Transportation":                ["services", "marketplace", "other"],
  "Travel":                        ["services", "marketplace", "saas", "ecommerce", "other"],
  "Wholesale & Distribution":      ["manufacturing", "retail", "ecommerce", "other"],
  "Other":                         ["ecommerce", "grocery", "grocery_online", "retail", "saas", "restaurant", "manufacturing", "services", "marketplace", "other"],
};


const BUSINESS_MODELS = ["B2C", "B2B", "B2B2C", "D2C", "Marketplace", "Subscription / SaaS", "Franchise", "Other"];
const STAGES = ["Idea", "MVP", "Early Revenue", "Growth", "Scaling", "Startup"];
const BUSINESS_SIZES = [
  { value: "1-10",   label: "1–10",   desc: "Micro / Solo",    icon: "👤" },
  { value: "11-50",  label: "11–50",  desc: "Small business",  icon: "👥" },
  { value: "51-200", label: "51–200", desc: "Mid-sized",        icon: "🏢" },
  { value: "201-500",label: "201–500",desc: "Growing enterprise",icon: "🏬" },
  { value: "500+",   label: "500+",   desc: "Large org",        icon: "🏭" },
];
const CURRENCIES = [
  "USD — US Dollar", "EUR — Euro", "GBP — British Pound", "INR — Indian Rupee",
  "PKR — Pakistani Rupee", "AED — UAE Dirham", "SAR — Saudi Riyal", "BDT — Bangladeshi Taka",
  "NGN — Nigerian Naira", "KES — Kenyan Shilling", "ZAR — South African Rand",
  "EGP — Egyptian Pound", "TRY — Turkish Lira", "BRL — Brazilian Real",
  "MXN — Mexican Peso", "CAD — Canadian Dollar", "AUD — Australian Dollar",
  "SGD — Singapore Dollar", "JPY — Japanese Yen", "CNY — Chinese Yuan", "Other",
];

// Business type → what steps to show
const STEP_CONFIG = {
  ecommerce: { showStores: false, showOnline: true, showPOS: false, showInventory: true },
  grocery: { showStores: true, showOnline: false, showPOS: true, showInventory: true },
  grocery_online: { showStores: true, showOnline: true, showPOS: true, showInventory: true },
  retail: { showStores: true, showOnline: false, showPOS: true, showInventory: true },
  saas: { showStores: false, showOnline: true, showPOS: false, showInventory: false },
  restaurant: { showStores: true, showOnline: false, showPOS: true, showInventory: false },
  manufacturing: { showStores: false, showOnline: false, showPOS: false, showInventory: true },
  services: { showStores: false, showOnline: false, showPOS: false, showInventory: false },
  marketplace: { showStores: false, showOnline: true, showPOS: false, showInventory: false },
  other: { showStores: false, showOnline: false, showPOS: false, showInventory: false },
};


// ════════════════════════════════════════════════════════════
// CHANNEL CONFIG — per businessType
// ════════════════════════════════════════════════════════════
const CHANNEL_CONFIG = {
  ecommerce: {
    title: "E-commerce Sales Channels",
    emoji: "🛔",
    hint: "Select all online marketplaces and direct channels you sell through.",
    sections: [
      {
        key: "online", label: "Online Marketplaces & Stores", icon: "🌐",
        items: [
          { type: "marketplace", platform: "Own Website",    icon: "🌍" },
          { type: "marketplace", platform: "Mobile App",     icon: "📱" },
          { type: "marketplace", platform: "Amazon",         icon: "📦" },
          { type: "marketplace", platform: "Flipkart",       icon: "🔵" },
          { type: "marketplace", platform: "Meesho",         icon: "🎀" },
          { type: "marketplace", platform: "Myntra",         icon: "👗" },
          { type: "marketplace", platform: "ONDC",           icon: "🔗" },
          { type: "marketplace", platform: "Shopify",        icon: "🛍️" },
          { type: "marketplace", platform: "WooCommerce",    icon: "🛒" },
          { type: "marketplace", platform: "Nykaa",          icon: "💄" },
          { type: "marketplace", platform: "Glowroad",       icon: "✨" },
          { type: "marketplace", platform: "Other",          icon: "➕" },
        ],
      },
      {
        key: "social", label: "Social Commerce", icon: "📣",
        items: [
          { type: "social", platform: "Instagram Shop",   icon: "📸" },
          { type: "social", platform: "Facebook Shop",    icon: "👍" },
          { type: "social", platform: "WhatsApp Business",icon: "💬" },
          { type: "social", platform: "YouTube",          icon: "▶️" },
        ],
      },
    ],
    payments: ["UPI", "Card", "Net Banking", "Wallet", "COD", "EMI", "Other"],
  },

  grocery: {
    title: "Grocery / Mart Sales Channels",
    emoji: "🛒",
    hint: "Tell us how your grocery business reaches customers.",
    sections: [
      {
        key: "physical", label: "Physical Locations", icon: "🏪",
        items: [
          { type: "physical_store", platform: "Supermarket / Mart",  icon: "🏬" },
          { type: "physical_store", platform: "Kiosk / Counter",     icon: "⛺" },
          { type: "physical_store", platform: "Wholesale Counter",   icon: "📦" },
        ],
      },
      {
        key: "online", label: "Online / Delivery Platforms", icon: "🚴",
        items: [
          { type: "marketplace", platform: "Own Website",     icon: "🌍" },
          { type: "marketplace", platform: "Mobile App",      icon: "📱" },
          { type: "marketplace", platform: "Blinkit",         icon: "⚡" },
          { type: "marketplace", platform: "Swiggy Instamart",icon: "🟠" },
          { type: "marketplace", platform: "Zepto",           icon: "🔵" },
          { type: "marketplace", platform: "BigBasket",       icon: "🧺" },
          { type: "marketplace", platform: "ONDC",            icon: "🔗" },
          { type: "marketplace", platform: "WhatsApp Orders", icon: "💬" },
          { type: "marketplace", platform: "Other",           icon: "➕" },
        ],
      },
    ],
    payments: ["Cash", "UPI", "Card", "Net Banking", "Wallet", "COD", "Other"],
  },

  grocery_online: {
    title: "Online Grocery Sales Channels",
    emoji: "🏪",
    hint: "Select your online and offline grocery selling channels.",
    sections: [
      {
        key: "physical", label: "Physical Locations", icon: "🏪",
        items: [
          { type: "physical_store", platform: "Grocery Store",  icon: "🏬" },
          { type: "physical_store", platform: "Dark Store",     icon: "🌑" },
        ],
      },
      {
        key: "online", label: "Online Delivery & Platforms", icon: "🚴",
        items: [
          { type: "marketplace", platform: "Own Website / App", icon: "🌍" },
          { type: "marketplace", platform: "Blinkit",           icon: "⚡" },
          { type: "marketplace", platform: "Swiggy Instamart",  icon: "🟠" },
          { type: "marketplace", platform: "Zepto",             icon: "🔵" },
          { type: "marketplace", platform: "BigBasket",         icon: "🧺" },
          { type: "marketplace", platform: "Amazon Fresh",      icon: "📦" },
          { type: "marketplace", platform: "ONDC",              icon: "🔗" },
          { type: "marketplace", platform: "Other",             icon: "➕" },
        ],
      },
    ],
    payments: ["Cash", "UPI", "Card", "Wallet", "COD", "Other"],
  },

  restaurant: {
    title: "Restaurant / Food Service Channels",
    emoji: "🍽️",
    hint: "How do customers order from you?",
    sections: [
      {
        key: "physical", label: "Dine-in & Physical", icon: "🍴",
        items: [
          { type: "physical_store", platform: "Dine-in Restaurant", icon: "🍽️" },
          { type: "physical_store", platform: "Cafe / Bakery",      icon: "☕" },
          { type: "physical_store", platform: "Food Truck",         icon: "🚚" },
          { type: "physical_store", platform: "Cloud Kitchen",      icon: "🌩️" },
        ],
      },
      {
        key: "delivery", label: "Delivery & Online Ordering", icon: "🛵",
        items: [
          { type: "marketplace", platform: "Zomato",         icon: "🔴" },
          { type: "marketplace", platform: "Swiggy",         icon: "🟠" },
          { type: "marketplace", platform: "Own Website",    icon: "🌍" },
          { type: "marketplace", platform: "Mobile App",     icon: "📱" },
          { type: "marketplace", platform: "WhatsApp Orders",icon: "💬" },
          { type: "marketplace", platform: "Magicpin",       icon: "🌟" },
          { type: "marketplace", platform: "ONDC",           icon: "🔗" },
          { type: "marketplace", platform: "Other",          icon: "➕" },
        ],
      },
    ],
    payments: ["Cash", "UPI", "Card", "Wallet", "COD", "Other"],
  },

  retail: {
    title: "Retail Sales Channels",
    emoji: "🏬",
    hint: "Select all the ways customers buy from your retail store.",
    sections: [
      {
        key: "physical", label: "Physical Retail", icon: "🏪",
        items: [
          { type: "physical_store", platform: "Retail Showroom",  icon: "🏬" },
          { type: "physical_store", platform: "Outlet / Branch",  icon: "🏪" },
          { type: "physical_store", platform: "Pop-up Store",     icon: "⛺" },
          { type: "physical_store", platform: "Multi-brand Outlet",icon: "🔖" },
        ],
      },
      {
        key: "online", label: "Online Channels", icon: "🌐",
        items: [
          { type: "marketplace", platform: "Own Website",  icon: "🌍" },
          { type: "marketplace", platform: "Amazon",       icon: "📦" },
          { type: "marketplace", platform: "Flipkart",     icon: "🔵" },
          { type: "marketplace", platform: "Meesho",       icon: "🎀" },
          { type: "marketplace", platform: "Instagram",    icon: "📸" },
          { type: "marketplace", platform: "Facebook Shop",icon: "👍" },
          { type: "marketplace", platform: "Other",        icon: "➕" },
        ],
      },
    ],
    payments: ["Cash", "UPI", "Card", "Net Banking", "Wallet", "COD", "EMI", "Other"],
  },

  saas: {
    title: "SaaS / Software Distribution Channels",
    emoji: "💻",
    hint: "How do users find and sign up for your software?",
    sections: [
      {
        key: "direct", label: "Direct & Self-serve", icon: "🌐",
        items: [
          { type: "marketplace", platform: "Own Website / Signup", icon: "🌍" },
          { type: "marketplace", platform: "Mobile App (iOS)",     icon: "🍎" },
          { type: "marketplace", platform: "Mobile App (Android)", icon: "🤖" },
          { type: "marketplace", platform: "Chrome Extension",     icon: "🧩" },
        ],
      },
      {
        key: "marketplace", label: "App Marketplaces", icon: "🏪",
        items: [
          { type: "marketplace", platform: "Google Play Store",    icon: "▶️" },
          { type: "marketplace", platform: "Apple App Store",      icon: "🍎" },
          { type: "marketplace", platform: "G2 / Capterra",        icon: "⭐" },
          { type: "marketplace", platform: "Product Hunt",         icon: "🐱" },
          { type: "marketplace", platform: "AWS Marketplace",      icon: "☁️" },
        ],
      },
      {
        key: "partners", label: "Sales & Partners", icon: "🤝",
        items: [
          { type: "marketplace", platform: "Reseller / Partner",   icon: "🤝" },
          { type: "marketplace", platform: "Enterprise Sales",     icon: "🏢" },
          { type: "marketplace", platform: "API / Integration",    icon: "🔗" },
          { type: "marketplace", platform: "Other",                icon: "➕" },
        ],
      },
    ],
    payments: ["Credit Card", "Stripe", "Razorpay", "PayPal", "Bank Transfer", "Invoice / NET-30", "Other"],
  },

  manufacturing: {
    title: "Manufacturing Sales Channels",
    emoji: "🏭",
    hint: "How does your manufactured product reach the market?",
    sections: [
      {
        key: "b2b", label: "B2B / Trade Channels", icon: "🏭",
        items: [
          { type: "marketplace", platform: "Direct to Retailer",    icon: "🏬" },
          { type: "marketplace", platform: "Wholesale / Distributor",icon: "📦" },
          { type: "marketplace", platform: "Dealer Network",        icon: "🤝" },
          { type: "marketplace", platform: "Export / International",icon: "🌍" },
          { type: "marketplace", platform: "Tender / Government",   icon: "📋" },
        ],
      },
      {
        key: "online", label: "Online / Direct", icon: "🌐",
        items: [
          { type: "marketplace", platform: "Own Website",      icon: "🌐" },
          { type: "marketplace", platform: "IndiaMART",        icon: "🟢" },
          { type: "marketplace", platform: "TradeIndia",       icon: "🔶" },
          { type: "marketplace", platform: "Alibaba / B2B",   icon: "🟠" },
          { type: "marketplace", platform: "Amazon Business", icon: "📦" },
          { type: "marketplace", platform: "Other",           icon: "➕" },
        ],
      },
    ],
    payments: ["Bank Transfer / NEFT", "Letter of Credit", "UPI", "Card", "Invoice / Credit Terms", "Other"],
  },

  services: {
    title: "Service Delivery Channels",
    emoji: "🤝",
    hint: "How do clients find and engage your services?",
    sections: [
      {
        key: "direct", label: "Direct Client Acquisition", icon: "🎯",
        items: [
          { type: "marketplace", platform: "Referrals / Word of Mouth", icon: "💬" },
          { type: "marketplace", platform: "Own Website",               icon: "🌍" },
          { type: "marketplace", platform: "LinkedIn",                  icon: "💼" },
          { type: "marketplace", platform: "Cold Outreach / Email",     icon: "📧" },
          { type: "marketplace", platform: "Events / Conferences",      icon: "🎤" },
        ],
      },
      {
        key: "platforms", label: "Service Marketplaces", icon: "🏪",
        items: [
          { type: "marketplace", platform: "Upwork",          icon: "🟢" },
          { type: "marketplace", platform: "Fiverr",          icon: "🟢" },
          { type: "marketplace", platform: "Toptal",          icon: "🔵" },
          { type: "marketplace", platform: "Freelancer.com",  icon: "🟠" },
          { type: "marketplace", platform: "PeoplePerHour",   icon: "⏰" },
          { type: "marketplace", platform: "UrbanClap / Urban Co.", icon: "🏠" },
          { type: "marketplace", platform: "Other",           icon: "➕" },
        ],
      },
    ],
    payments: ["Bank Transfer", "UPI", "PayPal", "Stripe", "Invoice / NET-30", "Retainer", "Other"],
  },

  marketplace: {
    title: "Marketplace / Platform Channels",
    emoji: "🔗",
    hint: "How do you acquire buyers and sellers on your platform?",
    sections: [
      {
        key: "acquisition", label: "User Acquisition", icon: "📣",
        items: [
          { type: "marketplace", platform: "Own Website / App",   icon: "🌍" },
          { type: "marketplace", platform: "Mobile App (iOS)",    icon: "🍎" },
          { type: "marketplace", platform: "Mobile App (Android)",icon: "🤖" },
          { type: "marketplace", platform: "Google / SEO",        icon: "🔍" },
          { type: "marketplace", platform: "Social Media Ads",    icon: "📱" },
          { type: "marketplace", platform: "Referral Program",    icon: "🎁" },
          { type: "marketplace", platform: "Partner Integrations",icon: "🤝" },
          { type: "marketplace", platform: "Other",               icon: "➕" },
        ],
      },
    ],
    payments: ["UPI", "Card", "Net Banking", "Wallet", "Stripe", "Razorpay", "Other"],
  },

  other: {
    title: "Sales Channels",
    emoji: "✨",
    hint: "Select all the channels relevant to your business.",
    sections: [
      {
        key: "physical", label: "Physical / In-person", icon: "🏪",
        items: [
          { type: "physical_store", platform: "Physical Store",   icon: "🏬" },
          { type: "physical_store", platform: "Kiosk / Stall",   icon: "⛺" },
          { type: "physical_store", platform: "Office / Studio",  icon: "🏢" },
        ],
      },
      {
        key: "online", label: "Online Channels", icon: "🌐",
        items: [
          { type: "marketplace", platform: "Own Website",   icon: "🌍" },
          { type: "marketplace", platform: "Mobile App",    icon: "📱" },
          { type: "marketplace", platform: "Amazon",        icon: "📦" },
          { type: "marketplace", platform: "Flipkart",      icon: "🔵" },
          { type: "marketplace", platform: "Instagram",     icon: "📸" },
          { type: "marketplace", platform: "WhatsApp",      icon: "💬" },
          { type: "marketplace", platform: "Other",         icon: "➕" },
        ],
      },
    ],
    payments: ["Cash", "UPI", "Card", "Net Banking", "Wallet", "COD", "Other"],
  },
};

const PAYMENT_METHODS = ["Cash", "UPI", "Card", "Net Banking", "Wallet", "COD", "Other"];

// ════════════════════════════════════════════════════════════
// STEP 3 — SALES CHANNELS (dynamic per businessType)
// ════════════════════════════════════════════════════════════
function StepSalesChannels({ form, onNext, onBack, saving }) {
  const [channels, setChannels] = useState([]);
  const { operatingModel, businessType } = form;

  const config = CHANNEL_CONFIG[businessType] || CHANNEL_CONFIG.other;
  const payments = config.payments || PAYMENT_METHODS;

  // Filter sections by operatingModel if relevant
  const visibleSections = config.sections.filter(sec => {
    if (operatingModel === "online_only"  && sec.key === "physical") return false;
    if (operatingModel === "offline_only" && (sec.key === "online" || sec.key === "delivery" || sec.key === "marketplace" || sec.key === "direct" || sec.key === "acquisition" || sec.key === "partners" || sec.key === "b2b" || sec.key === "social")) return false;
    return true;
  });

  const toggle = (type, platform) => {
    const key = platform || type;
    setChannels(prev =>
      prev.some(c => (c.platformName || c.channelType) === key)
        ? prev.filter(c => (c.platformName || c.channelType) !== key)
        : [...prev, { channelType: type, platformName: platform || "" }]
    );
  };
  const isChecked = (type, platform) =>
    channels.some(c => (c.platformName || c.channelType) === (platform || type));

  return (
    <div className="q-fade-in" style={{ maxWidth: 660, margin: "0 auto" }}>
      <StepHeader
        icon={ShoppingCart}
        title={config.title}
        desc={config.hint}
      />

      {/* Business type context badge */}
      <div style={{
        marginBottom: 20, padding: "10px 16px", borderRadius: 10,
        background: "linear-gradient(135deg,#EFF6FF,#F0FDF4)",
        border: "1px solid #BFDBFE", display: "flex", alignItems: "center", gap: 10,
      }}>
        <span style={{ fontSize: "1.5rem" }}>{config.emoji}</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "#1e40af" }}>
            Customized for: {businessType?.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
          </div>
          <div style={{ fontSize: "0.78rem", color: "#3B82F6", marginTop: 2 }}>
            Select all channels & platforms that apply to your business
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Dynamic channel sections */}
        {visibleSections.map(section => (
          <div key={section.key} style={s.card}>
            <h3 style={{ fontWeight: 700, marginBottom: 14, fontSize: "0.9375rem", color: "var(--q-text-1)", display: "flex", alignItems: "center", gap: 8 }}>
              <span>{section.icon}</span> {section.label}
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 8 }}>
              {section.items.map(item => (
                <CheckPill
                  key={item.platform}
                  checked={isChecked(item.type, item.platform)}
                  onChange={() => toggle(item.type, item.platform)}
                  label={item.platform}
                  icon={item.icon}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Payment Methods — business-type specific */}
        <div style={s.card}>
          <h3 style={{ fontWeight: 700, marginBottom: 14, fontSize: "0.9375rem", color: "var(--q-text-1)", display: "flex", alignItems: "center", gap: 8 }}>
            <span>💳</span> Payment Methods
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 8 }}>
            {payments.map(p => (
              <CheckPill
                key={p}
                checked={isChecked("payment", p)}
                onChange={() => toggle("payment", p)}
                label={p}
                icon="💳"
              />
            ))}
          </div>
        </div>

        {/* Selected count badge */}
        {channels.length > 0 && (
          <div style={{
            padding: "10px 16px", borderRadius: 10, background: "#F0FDF4",
            border: "1px solid #86EFAC", fontSize: "0.875rem", color: "#166534",
            display: "flex", alignItems: "center", gap: 8, fontWeight: 600,
          }}>
            ✅ {channels.length} channel{channels.length > 1 ? "s" : ""} selected
          </div>
        )}
      </div>

      <NavButtons
        onBack={onBack}
        onNext={() => onNext(channels.length ? channels : [{ channelType: "general", platformName: "" }])}
        loading={saving}
      />
    </div>
  );
}


// ════════════════════════════════════════════════════════════
// YUP SCHEMA
// ════════════════════════════════════════════════════════════
const businessDetailsSchema = yup.object({
  businessName:  yup.string().trim().required("Business name is required").min(2, "Min 2 characters"),
  industry:      yup.string().required("Please select an industry"),
  businessType:  yup.string().required("Please select a business type"),
  businessModel: yup.string().optional(),
  stage:         yup.string().required("Please select a stage"),
  country:       yup.string().required("Country is required"),
  state:         yup.string().optional(),
  city:          yup.string().optional(),
  pincode:       yup.string().optional(),
  currency:      yup.string().required("Currency is required"),
  website:       yup.string().transform(v => v === "" ? undefined : v).url("Enter a valid URL (e.g. https://example.com)").optional(),
  description:   yup.string().optional(),
  employeeCount: yup.string().optional(),
});

// ════════════════════════════════════════════════════════════
// SHARED UI PRIMITIVES
// ════════════════════════════════════════════════════════════
const s = {
  input: {
    width: "100%", padding: "11px 14px", border: "1.5px solid var(--q-border)",
    borderRadius: 10, fontSize: "0.9375rem", fontFamily: "inherit",
    background: "var(--q-surface)", color: "var(--q-text-1)",
    outline: "none", transition: "border-color 0.2s, box-shadow 0.2s",
    boxSizing: "border-box",
  },
  inputError: { borderColor: "#DC2626" },
  label: {
    display: "block", fontSize: "0.8125rem", fontWeight: 600,
    color: "var(--q-text-2)", marginBottom: 6, letterSpacing: "0.01em",
  },
  card: {
    background: "var(--q-surface)", border: "1.5px solid var(--q-border)",
    borderRadius: 16, padding: 28,
  },
  checkRow: (checked) => ({
    display: "flex", alignItems: "center", gap: 12, padding: "13px 16px",
    borderRadius: 10, border: `1.5px solid ${checked ? "#2563EB" : "var(--q-border)"}`,
    background: checked ? "#EFF6FF" : "var(--q-surface)", cursor: "pointer",
    transition: "all 0.15s", userSelect: "none",
  }),
};

function FieldError({ message }) {
  if (!message) return null;
  return (
    <div style={{ fontSize: "0.78rem", color: "#DC2626", marginTop: 5, display: "flex", alignItems: "center", gap: 4 }}>
      <AlertCircle size={12} />{message}
    </div>
  );
}

function Inp({ label, required, error, ...props }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {label && <label style={s.label}>{label}{required && <span style={{ color: "#DC2626" }}> *</span>}</label>}
      <input style={{ ...s.input, ...(error ? s.inputError : {}) }} {...props} />
      <FieldError message={error} />
    </div>
  );
}

function Sel({ label, required, error, children, ...props }) {
  return (
    <div>
      {label && <label style={s.label}>{label}{required && <span style={{ color: "#DC2626" }}> *</span>}</label>}
      <select style={{ ...s.input, ...(error ? s.inputError : {}) }} {...props}>{children}</select>
      <FieldError message={error} />
    </div>
  );
}

function CheckPill({ checked, onChange, label, icon }) {
  return (
    <div style={s.checkRow(checked)} onClick={onChange}>
      <div style={{
        width: 20, height: 20, borderRadius: 5,
        border: `2px solid ${checked ? "#2563EB" : "var(--q-border)"}`,
        background: checked ? "#2563EB" : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        {checked && <Check size={12} color="#fff" strokeWidth={3} />}
      </div>
      {icon && <span style={{ fontSize: "1.1rem" }}>{icon}</span>}
      <span style={{ fontSize: "0.9rem", fontWeight: 500, color: checked ? "#2563EB" : "var(--q-text-1)" }}>{label}</span>
    </div>
  );
}

function RadioPill({ checked, onChange, label, icon, desc }) {
  return (
    <div style={{
      ...s.checkRow(checked),
      flexDirection: "column", alignItems: "flex-start", gap: 4,
    }} onClick={onChange}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 18, height: 18, borderRadius: "50%",
          border: `2px solid ${checked ? "#2563EB" : "var(--q-border)"}`,
          background: checked ? "#2563EB" : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          {checked && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff" }} />}
        </div>
        {icon && <span>{icon}</span>}
        <span style={{ fontWeight: 600, fontSize: "0.9375rem", color: checked ? "#2563EB" : "var(--q-text-1)" }}>{label}</span>
      </div>
      {desc && <p style={{ fontSize: "0.8125rem", color: "var(--q-text-3)", margin: "0 0 0 28px", lineHeight: 1.5 }}>{desc}</p>}
    </div>
  );
}

function StepHeader({ icon: Icon, title, desc, color = "#2563EB" }) {
  return (
    <div style={{ textAlign: "center", marginBottom: 32 }}>
      <div style={{ width: 56, height: 56, borderRadius: 16, background: color + "15", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
        <Icon size={24} color={color} />
      </div>
      <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--q-text-1)", marginBottom: 8 }}>{title}</h2>
      {desc && <p style={{ color: "var(--q-text-3)", fontSize: "0.9375rem", maxWidth: 480, margin: "0 auto" }}>{desc}</p>}
    </div>
  );
}

function NavButtons({ onBack, onNext, nextLabel = "Continue", disabled, loading }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 32, gap: 12 }}>
      <button className="q-btn q-btn-outline" onClick={onBack} style={{ gap: 6 }}>
        <ArrowLeft size={16} /> Back
      </button>
      <button className="q-btn q-btn-primary" onClick={onNext} disabled={disabled || loading} style={{ gap: 6, minWidth: 140 }}>
        {loading ? <><div className="q-spinner" style={{ width: 16, height: 16, borderWidth: 2, borderTopColor: "#fff", borderColor: "rgba(255,255,255,0.3)" }} /> Saving...</> : <>{nextLabel} <ArrowRight size={16} /></>}
      </button>
    </div>
  );
}

function WizardProgress({ steps, current }) {
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 48, overflowX: "auto", gap: 0 }}>
      {steps.map((step, i) => {
        const done = i < current, active = i === current;
        return (
          <div key={step.label} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: done ? "#059669" : active ? "#2563EB" : "var(--q-surface-3)",
                border: `2px solid ${done ? "#059669" : active ? "#2563EB" : "var(--q-border)"}`,
                display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s",
              }}>
                {done ? <Check size={14} color="#fff" /> : <span style={{ fontSize: "0.75rem", fontWeight: 700, color: active ? "#fff" : "var(--q-text-4)" }}>{i + 1}</span>}
              </div>
              <span style={{ fontSize: "0.65rem", fontWeight: 600, color: active ? "#2563EB" : done ? "#059669" : "var(--q-text-4)", whiteSpace: "nowrap", maxWidth: 64, textAlign: "center" }}>{step.label}</span>
            </div>
            {i < steps.length - 1 && <div style={{ height: 2, width: 40, background: i < current ? "#059669" : "var(--q-surface-3)", margin: "0 4px", marginBottom: 22 }} />}
          </div>
        );
      })}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// STEP 0 — CHOOSE PATH
// ════════════════════════════════════════════════════════════
function ChoosePath({ onChoice }) {
  const [hov, setHov] = useState(null);
  const cards = [
    { id: "business", Icon: Building2, color: "#8B1A1A", bg: "#FDF2F2", title: "Analyze My Existing Business", desc: "Upload your data and let Quantora detect opportunities, risks, trends and recommend the next best actions." },
    { id: "idea", Icon: Zap, color: "#2563EB", bg: "#EFF6FF", title: "Validate a Business Idea", desc: "Test your idea against market demand, competition, pricing, and revenue potential before you build." },
  ];
  return (
    <div className="q-fade-in" style={{ maxWidth: 720, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h1 style={{ fontSize: "1.875rem", fontWeight: 800, color: "var(--q-text-1)", marginBottom: 12 }}>What do you want to do with Quantora?</h1>
        <p style={{ color: "var(--q-text-3)", fontSize: "1.0625rem" }}>We'll set up your experience based on your goal.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
        {cards.map(({ id, Icon, color, bg, title, desc }) => (
          <button key={id} onClick={() => onChoice(id)} onMouseEnter={() => setHov(id)} onMouseLeave={() => setHov(null)}
            style={{ padding: "32px 28px", borderRadius: 16, border: `2px solid ${hov === id ? color : "var(--q-border)"}`, background: hov === id ? bg + "88" : "var(--q-surface)", cursor: "pointer", textAlign: "left", fontFamily: "inherit", transition: "all 0.2s", transform: hov === id ? "translateY(-3px)" : "none", boxShadow: hov === id ? `0 8px 24px ${color}20` : "none" }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
              <Icon size={24} color={color} />
            </div>
            <h3 style={{ fontWeight: 700, fontSize: "1.125rem", color: "var(--q-text-1)", marginBottom: 10 }}>{title}</h3>
            <p style={{ fontSize: "0.9rem", color: "var(--q-text-3)", lineHeight: 1.65, marginBottom: 20 }}>{desc}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color, fontWeight: 600, fontSize: "0.9375rem" }}>Get Started <ArrowRight size={16} /></div>
          </button>
        ))}
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "0.875rem", color: "var(--q-text-4)", marginBottom: 12 }}>or</div>
        <button onClick={() => onChoice("demo")} style={{ padding: "13px 28px", borderRadius: 100, border: "1px solid var(--q-border)", background: "var(--q-surface)", cursor: "pointer", fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 8, fontSize: "0.9375rem", color: "var(--q-text-2)", fontWeight: 500 }}>
          <Play size={16} /> Explore Demo (NovaMart sample data)
        </button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// STEP 1 — BUSINESS DETAILS (react-hook-form + yup)
// ════════════════════════════════════════════════════════════
function StepBusinessDetails({ onNext, onBack, saving }) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(businessDetailsSchema),
    defaultValues: {
      businessName: "", industry: "", businessType: "", businessModel: "",
      stage: "Early Revenue", country: "", state: "", city: "", pincode: "",
      currency: "USD — US Dollar", website: "", description: "", employeeCount: "",
    },
  });

  const [countrySearch, setCountrySearch] = useState("");
  const [showCountries, setShowCountries] = useState(false);
  const selectedCountry = watch("country");
  const selectedBizType = watch("businessType");
  const selectedIndustry = watch("industry");
  const filtered = COUNTRIES.filter(c => c.toLowerCase().includes(countrySearch.toLowerCase()));

  // Dynamic business type filtering based on selected industry
  const allowedTypeIds = selectedIndustry ? (INDUSTRY_TO_BUSINESS_TYPES[selectedIndustry] || BUSINESS_TYPES.map(b => b.id)) : null;
  const filteredBizTypes = allowedTypeIds
    ? BUSINESS_TYPES.filter(bt => allowedTypeIds.includes(bt.id))
    : BUSINESS_TYPES;

  // Auto-reset businessType if it's not valid for the new industry
  const prevIndustry = useRef("");
  if (selectedIndustry !== prevIndustry.current) {
    prevIndustry.current = selectedIndustry;
    if (selectedBizType && allowedTypeIds && !allowedTypeIds.includes(selectedBizType)) {
      setValue("businessType", "", { shouldValidate: false });
    }
  }

  const onSubmit = (data) => onNext(data);

  return (
    <div className="q-fade-in" style={{ maxWidth: 700, margin: "0 auto" }}>
      <StepHeader icon={Building2} title="Tell us about your business" desc="This helps Quantora personalize analysis and recommendations for your specific business." />

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div style={s.card}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Business Name */}
            <Inp
              label="Business Name" required
              placeholder="e.g. ABC Mart"
              error={errors.businessName?.message}
              {...register("businessName")}
            />

            {/* Industry + Stage */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Sel label="Industry" required error={errors.industry?.message} {...register("industry")}>
                <option value="">Select industry</option>
                {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
              </Sel>
              <Sel label="Business Stage" {...register("stage")}>
                {STAGES.map(st => <option key={st} value={st}>{st}</option>)}
              </Sel>
            </div>

            {/* Business Type — dynamic based on selected industry */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <label style={s.label}>Business Type <span style={{ color: "#DC2626" }}>*</span></label>
                {selectedIndustry && (
                  <span style={{
                    fontSize: "0.72rem", fontWeight: 600, padding: "3px 10px",
                    borderRadius: 100, background: "#EFF6FF", color: "#2563EB",
                    border: "1px solid #BFDBFE", letterSpacing: "0.02em",
                  }}>
                    📂 {filteredBizTypes.length} types for "{selectedIndustry.split(" & ")[0]}"
                  </span>
                )}
              </div>

              {!selectedIndustry && (
                <div style={{ marginBottom: 10, padding: "10px 14px", borderRadius: 10, background: "#F8FAFC", border: "1px dashed var(--q-border)", fontSize: "0.8125rem", color: "var(--q-text-4)", display: "flex", alignItems: "center", gap: 8 }}>
                  <span>💡</span> Select an industry above to see relevant business types
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 }}>
                {filteredBizTypes.map(bt => (
                  <button
                    key={bt.id} type="button"
                    onClick={() => setValue("businessType", bt.id, { shouldValidate: true })}
                    style={{
                      padding: "12px 14px", borderRadius: 10,
                      border: `2px solid ${selectedBizType === bt.id ? "#2563EB" : "var(--q-border)"}`,
                      background: selectedBizType === bt.id ? "#EFF6FF" : "var(--q-surface)",
                      cursor: "pointer", fontFamily: "inherit",
                      textAlign: "left", transition: "all 0.18s",
                      display: "flex", alignItems: "center", gap: 8,
                      animation: "fadeInUp 0.2s ease",
                    }}
                  >
                    <span style={{ fontSize: "1.25rem" }}>{bt.icon}</span>
                    <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: selectedBizType === bt.id ? "#2563EB" : "var(--q-text-2)", lineHeight: 1.3 }}>{bt.label}</span>
                    {selectedBizType === bt.id && <Check size={14} color="#2563EB" style={{ marginLeft: "auto", flexShrink: 0 }} />}
                  </button>
                ))}
              </div>
              <FieldError message={errors.businessType?.message} />
            </div>

            {/* Business Model + Currency */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Sel label="Business Model" {...register("businessModel")}>
                <option value="">Select model</option>
                {BUSINESS_MODELS.map(m => <option key={m} value={m}>{m}</option>)}
              </Sel>
              <Sel label="Currency" required error={errors.currency?.message} {...register("currency")}>
                {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
              </Sel>
            </div>

            {/* Country with search */}
            <div style={{ position: "relative" }}>
              <label style={s.label}>Country <span style={{ color: "#DC2626" }}>*</span></label>
              <input
                style={{ ...s.input, ...(errors.country ? s.inputError : {}) }}
                placeholder="Search country..."
                value={selectedCountry || countrySearch}
                onChange={e => { setCountrySearch(e.target.value); setValue("country", "", { shouldValidate: false }); setShowCountries(true); }}
                onFocus={() => setShowCountries(true)}
                onBlur={() => setTimeout(() => setShowCountries(false), 150)}
              />
              {showCountries && countrySearch && !selectedCountry && (
                <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "var(--q-surface)", border: "1px solid var(--q-border)", borderRadius: 10, boxShadow: "var(--q-shadow-lg)", zIndex: 200, maxHeight: 200, overflowY: "auto" }}>
                  {filtered.slice(0, 20).map(c => (
                    <div key={c}
                      onMouseDown={() => { setValue("country", c, { shouldValidate: true }); setCountrySearch(""); }}
                      style={{ padding: "10px 14px", cursor: "pointer", fontSize: "0.9rem" }}
                      onMouseEnter={e => e.target.style.background = "var(--q-surface-2)"}
                      onMouseLeave={e => e.target.style.background = "transparent"}
                    >{c}</div>
                  ))}
                  {filtered.length === 0 && <div style={{ padding: "10px 14px", color: "var(--q-text-4)" }}>No country found</div>}
                </div>
              )}
              <FieldError message={errors.country?.message} />
            </div>

            {/* State / City / Pincode */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              <Inp label="State / Region" placeholder="e.g. Maharashtra" {...register("state")} />
              <Inp label="City"           placeholder="e.g. Mumbai"      {...register("city")} />
              <Inp label="Pincode"        placeholder="e.g. 400001"      {...register("pincode")} />
            </div>

            {/* Website */}
            <Inp
              label="Website (optional)"
              placeholder="https://yourbusiness.com"
              error={errors.website?.message}
              {...register("website")}
            />

            {/* Business Size — professional visual cards */}
            <div>
              <label style={{ ...s.label, marginBottom: 10 }}>Team / Business Size</label>
              <Controller
                name="employeeCount"
                control={control}
                render={({ field }) => (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
                    {BUSINESS_SIZES.map(sz => {
                      const active = field.value === sz.value;
                      return (
                        <button key={sz.value} type="button" onClick={() => field.onChange(sz.value)}
                          style={{
                            padding: "14px 8px", borderRadius: 12,
                            border: `2px solid ${active ? "#2563EB" : "var(--q-border)"}`,
                            background: active ? "#EFF6FF" : "var(--q-surface)",
                            cursor: "pointer", fontFamily: "inherit",
                            display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                            transition: "all 0.15s",
                          }}
                        >
                          <span style={{ fontSize: "1.5rem" }}>{sz.icon}</span>
                          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: active ? "#2563EB" : "var(--q-text-2)" }}>{sz.label}</span>
                          <span style={{ fontSize: "0.65rem", color: active ? "#3B82F6" : "var(--q-text-4)", textAlign: "center", lineHeight: 1.3 }}>{sz.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              />
            </div>

            {/* Description */}
            <div>
              <label style={s.label}>Description (optional)</label>
              <textarea
                style={{ ...s.input, minHeight: 80, resize: "vertical" }}
                placeholder="Brief description of your business..."
                {...register("description")}
              />
            </div>
          </div>
        </div>

        {/* Nav buttons as part of the form so submit triggers on Enter */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 32, gap: 12 }}>
          <button type="button" className="q-btn q-btn-outline" onClick={onBack} style={{ gap: 6 }}>
            <ArrowLeft size={16} /> Back
          </button>
          <button type="submit" className="q-btn q-btn-primary" disabled={saving} style={{ gap: 6, minWidth: 160 }}>
            {saving
              ? <><div className="q-spinner" style={{ width: 16, height: 16, borderWidth: 2, borderTopColor: "#fff", borderColor: "rgba(255,255,255,0.3)" }} /> Saving...</>
              : <>Save & Continue <ArrowRight size={16} /></>}
          </button>
        </div>
      </form>
    </div>
  );
}


// ════════════════════════════════════════════════════════════
// STEP 2 — OPERATING MODEL
// ════════════════════════════════════════════════════════════
function StepOperatingModel({ form, onNext, onBack, saving }) {
  const [model, setModel] = useState(form.operatingModel || "");
  const options = [
    { id: "online_only", icon: "🌐", label: "Online Only", desc: "You sell exclusively through your website, apps, or marketplaces." },
    { id: "offline_only", icon: "🏪", label: "Offline Only", desc: "You operate physical stores, restaurants, or service locations." },
    { id: "hybrid", icon: "🔀", label: "Hybrid", desc: "You have both physical presence and online sales channels." },
  ];
  return (
    <div className="q-fade-in" style={{ maxWidth: 580, margin: "0 auto" }}>
      <StepHeader icon={Globe} title="How do you operate?" desc="This determines which setup questions are relevant for your business." />
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 8 }}>
        {options.map(o => (
          <RadioPill key={o.id} checked={model === o.id} onChange={() => setModel(o.id)} icon={o.icon} label={o.label} desc={o.desc} />
        ))}
      </div>
      <NavButtons onBack={onBack} onNext={() => onNext(model)} disabled={!model} loading={saving} />
    </div>
  );
}


// ════════════════════════════════════════════════════════════
// STEP 4 — STORE LOCATIONS (offline/hybrid only)
// ════════════════════════════════════════════════════════════
function StepStoreLocations({ form, onNext, onBack, saving }) {
  const [stores, setStores] = useState([{ name: "", address: "", city: "", state: "", country: form.business?.country || "", pincode: "", storeType: "", status: "active" }]);
  const update = (i, k, v) => setStores(prev => prev.map((s, idx) => idx === i ? { ...s, [k]: v } : s));
  const add = () => setStores(prev => [...prev, { name: "", address: "", city: "", state: "", country: "", pincode: "", storeType: "", status: "active" }]);
  const remove = (i) => setStores(prev => prev.filter((_, idx) => idx !== i));

  return (
    <div className="q-fade-in" style={{ maxWidth: 680, margin: "0 auto" }}>
      <StepHeader icon={Store} title="Your Store Locations" desc="Tell us about your physical stores, outlets, or branches." />

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {stores.map((store, i) => (
          <div key={i} style={{ ...s.card, position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontWeight: 700, fontSize: "0.9375rem" }}>Store {i + 1}</span>
              {stores.length > 1 && (
                <button onClick={() => remove(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "#DC2626", display: "flex", alignItems: "center", gap: 4, fontSize: "0.8125rem", fontWeight: 600 }}>
                  <Trash2 size={14} /> Remove
                </button>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <Inp label="Store Name" placeholder="e.g. Main Branch" value={store.name} onChange={e => update(i, "name", e.target.value)} />
                <Sel label="Store Type" value={store.storeType} onChange={e => update(i, "storeType", e.target.value)}>
                  <option value="">Select type</option>
                  {["Supermarket", "Grocery Store", "Mini Mart", "Warehouse", "Showroom", "Outlet", "Restaurant", "Cafe", "Other"].map(t => <option key={t} value={t}>{t}</option>)}
                </Sel>
              </div>
              <Inp label="Address" placeholder="Street address" value={store.address} onChange={e => update(i, "address", e.target.value)} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                <Inp label="City" placeholder="City" value={store.city} onChange={e => update(i, "city", e.target.value)} />
                <Inp label="State" placeholder="State" value={store.state} onChange={e => update(i, "state", e.target.value)} />
                <Inp label="Pincode" placeholder="Pincode" value={store.pincode} onChange={e => update(i, "pincode", e.target.value)} />
              </div>
            </div>
          </div>
        ))}
        <button onClick={add} style={{ padding: "12px", borderRadius: 10, border: "2px dashed var(--q-border)", background: "transparent", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: "var(--q-text-3)", fontWeight: 600, fontSize: "0.9rem" }}>
          <Plus size={16} /> Add Another Store
        </button>
      </div>

      <NavButtons onBack={onBack} onNext={() => onNext(stores)} loading={saving} />
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// STEP 5 — POS / BILLING
// ════════════════════════════════════════════════════════════
function StepPOS({ onNext, onBack, saving }) {
  const [hasPos, setHasPos] = useState(null);
  const [pos, setPos] = useState({ provider: "", billingSoftware: "", terminalCount: "", canExportSales: false, canExportInventory: false });
  const set = (k, v) => setPos(p => ({ ...p, [k]: v }));

  return (
    <div className="q-fade-in" style={{ maxWidth: 580, margin: "0 auto" }}>
      <StepHeader icon={Package} title="POS / Billing Setup" desc="Do you use a Point of Sale or billing software?" />

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
        <RadioPill checked={hasPos === true} onChange={() => setHasPos(true)} label="Yes, I use POS / billing software" icon="✅" />
        <RadioPill checked={hasPos === false} onChange={() => setHasPos(false)} label="No, I don't use POS software" icon="❌" />
      </div>

      {hasPos === true && (
        <div style={{ ...s.card, marginBottom: 8 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Inp label="POS / Billing Software Name" placeholder="e.g. Petpooja, PosBytz, Marg" value={pos.provider} onChange={e => set("provider", e.target.value)} />
              <Inp
                label="Number of POS Terminals"
                type="number" min="1" step="1"
                placeholder="e.g. 2"
                value={pos.terminalCount}
                onChange={e => set("terminalCount", Math.max(1, parseInt(e.target.value) || 1))}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <CheckPill checked={pos.canExportSales} onChange={() => set("canExportSales", !pos.canExportSales)} label="Can export sales / billing data" icon="📤" />
              <CheckPill checked={pos.canExportInventory} onChange={() => set("canExportInventory", !pos.canExportInventory)} label="Can export inventory data" icon="📦" />
            </div>
          </div>
        </div>
      )}

      <NavButtons onBack={onBack} onNext={() => onNext(hasPos ? pos : null)} disabled={hasPos === null} loading={saving} />
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// STEP 6 — FINANCIAL HISTORY
// ════════════════════════════════════════════════════════════
function StepFinancialHistory({ form, onNext, onBack, saving }) {
  const fileRef = useRef(null);
  const [method, setMethod] = useState("manual");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [uploadErr, setUploadErr] = useState("");
  const [records, setRecords] = useState([
    { periodType: "year", periodStart: "2024-01-01", periodEnd: "2024-12-31", revenue: "", cogs: "", grossProfit: "", operatingExpenses: "", marketingSpend: "", netProfit: "" },
    { periodType: "year", periodStart: "2025-01-01", periodEnd: "2025-12-31", revenue: "", cogs: "", grossProfit: "", operatingExpenses: "", marketingSpend: "", netProfit: "" },
  ]);

  const updateRec = (i, k, v) => setRecords(prev => prev.map((r, idx) => idx === i ? { ...r, [k]: v } : r));
  const addRec = () => setRecords(prev => [...prev, { periodType: "year", periodStart: "", periodEnd: "", revenue: "", cogs: "", grossProfit: "", operatingExpenses: "", marketingSpend: "", netProfit: "" }]);

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f); setUploadErr("");
  };

  const uploadFinancialFile = async () => {
    if (!file || !form.businessId) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("businessId", form.businessId);
      await API.post("/businesses/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setUploaded(true);
    } catch (err) {
      setUploadErr(err.response?.data?.message || "Upload failed");
    } finally { setUploading(false); }
  };

  const proceed = () => {
    if (method === "skip") return onNext([]);
    if (method === "upload" && uploaded) return onNext([]);
    if (method === "manual") return onNext(records.filter(r => r.revenue || r.netProfit));
  };

  return (
    <div className="q-fade-in" style={{ maxWidth: 680, margin: "0 auto" }}>
      <StepHeader icon={DollarSign} title="Financial History" desc="Add your historical financial data. This powers AI analysis, risk detection, and forecasting." color="#059669" />

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        {[{ id: "manual", icon: "✍️", label: "Enter Manually", desc: "Fill in your revenue and expenses year by year." },
        { id: "upload", icon: "📤", label: "Upload Excel / CSV", desc: "Upload your financial statement, P&L, or income report." },
        { id: "skip", icon: "⏭️", label: "Skip for now", desc: "You can add financial data later from the dashboard." }
        ].map(o => (
          <RadioPill key={o.id} checked={method === o.id} onChange={() => setMethod(o.id)} icon={o.icon} label={o.label} desc={o.desc} />
        ))}
      </div>

      {method === "manual" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {records.map((rec, i) => (
            <div key={i} style={s.card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <span style={{ fontWeight: 700 }}>Period {i + 1}</span>
                {records.length > 1 && <button onClick={() => setRecords(p => p.filter((_, idx) => idx !== i))} style={{ background: "none", border: "none", color: "#DC2626", cursor: "pointer", fontWeight: 600, fontSize: "0.8125rem" }}><Trash2 size={14} /> Remove</button>}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
                <Sel label="Period Type" value={rec.periodType} onChange={e => updateRec(i, "periodType", e.target.value)}>
                  <option value="year">Yearly</option>
                  <option value="month">Monthly</option>
                  <option value="quarter">Quarterly</option>
                </Sel>
                <Inp label="Start Date" type="date" value={rec.periodStart} onChange={e => updateRec(i, "periodStart", e.target.value)} />
                <Inp label="End Date" type="date" value={rec.periodEnd} onChange={e => updateRec(i, "periodEnd", e.target.value)} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                {[["revenue", "Revenue"], ["cogs", "COGS"], ["grossProfit", "Gross Profit"], ["operatingExpenses", "Operating Expenses"], ["marketingSpend", "Marketing Spend"], ["netProfit", "Net Profit / Loss"]].map(([k, lbl]) => (
                  <Inp key={k} label={lbl} type="number" min="0" step="1" placeholder="0" value={rec[k]} onChange={e => updateRec(i, k, e.target.value === "" ? "" : parseInt(e.target.value) || 0)} />
                ))}
              </div>
            </div>
          ))}
          <button onClick={addRec} style={{ padding: "12px", borderRadius: 10, border: "2px dashed var(--q-border)", background: "transparent", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: "var(--q-text-3)", fontWeight: 600 }}>
            <Plus size={16} /> Add Another Period
          </button>
        </div>
      )}

      {method === "upload" && (
        <div style={s.card}>
          {!uploaded ? (
            <>
              <div onClick={() => fileRef.current?.click()} style={{ border: "2px dashed var(--q-border)", borderRadius: 12, padding: "32px", textAlign: "center", cursor: "pointer", background: file ? "var(--q-success-bg)" : "var(--q-surface-2)" }}>
                <UploadCloud size={32} style={{ color: file ? "var(--q-success)" : "var(--q-text-4)", margin: "0 auto 10px" }} />
                {file ? <div style={{ fontWeight: 600, color: "var(--q-success)" }}>✓ {file.name}</div>
                  : <><div style={{ fontWeight: 600, color: "var(--q-text-2)" }}>Click to select or drag & drop</div><div style={{ fontSize: "0.8125rem", color: "var(--q-text-4)", marginTop: 4 }}>P&L, Income Statement — .csv, .xlsx</div></>}
              </div>
              <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" style={{ display: "none" }} onChange={handleFile} />
              {uploadErr && <div style={{ marginTop: 10, color: "#DC2626", fontSize: "0.875rem" }}>{uploadErr}</div>}
              {file && <button onClick={uploadFinancialFile} disabled={uploading} className="q-btn q-btn-blue" style={{ width: "100%", marginTop: 12 }}>{uploading ? "Uploading..." : "Upload File"}</button>}
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <CheckCircle2 size={40} color="var(--q-success)" style={{ margin: "0 auto 10px" }} />
              <div style={{ fontWeight: 700 }}>File uploaded successfully!</div>
              <div style={{ fontSize: "0.875rem", color: "var(--q-text-3)", marginTop: 4 }}>{file.name}</div>
            </div>
          )}
        </div>
      )}

      <NavButtons onBack={onBack} onNext={proceed} disabled={method === "upload" && !uploaded} loading={saving} />
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// STEP 7 — COMPLIANCE
// ════════════════════════════════════════════════════════════
function StepCompliance({ form, onNext, onBack, saving }) {
  const [comp, setComp] = useState({
    gstRegistered: null, gstin: "", gstRates: "",
    fssaiApplicable: null, fssaiLicense: "",
    privacyPolicy: "", returnPolicy: "",
  });
  const set = (k, v) => setComp(c => ({ ...c, [k]: v }));
  const isFood = ["grocery", "grocery_online", "restaurant"].includes(form.businessType);

  // Reusable Yes / No / Not Applicable toggle
  const ToggleBtns = ({ label, stateKey, value }) => (
    <div>
      <label style={{ ...s.label, marginBottom: 10 }}>{label}</label>
      <div style={{ display: "flex", gap: 10 }}>
        {[{ v: true, l: "Yes" }, { v: false, l: "No" }, { v: null, l: "Not Applicable" }].map(o => (
          <button
            key={String(o.v)} type="button"
            onClick={() => set(stateKey, o.v)}
            style={{
              flex: 1, padding: "10px", borderRadius: 8,
              border: `1.5px solid ${value === o.v ? "#2563EB" : "var(--q-border)"}`,
              background: value === o.v ? "#EFF6FF" : "var(--q-surface)",
              cursor: "pointer", fontFamily: "inherit", fontWeight: 600,
              fontSize: "0.875rem", color: value === o.v ? "#2563EB" : "var(--q-text-2)",
            }}
          >{o.l}</button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="q-fade-in" style={{ maxWidth: 620, margin: "0 auto" }}>
      <StepHeader icon={ClipboardCheck} title="Compliance & Legal" desc="Applicable compliance information. All fields are optional." />
      <div style={s.card}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          <ToggleBtns label="Are you GST registered?" stateKey="gstRegistered" value={comp.gstRegistered} />
          {comp.gstRegistered === true && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Inp label="GSTIN" placeholder="27AAPFU0939F1ZV" value={comp.gstin}    onChange={e => set("gstin",    e.target.value)} />
              <Inp label="GST Rate(s)" placeholder="5%, 12%, 18%"  value={comp.gstRates} onChange={e => set("gstRates", e.target.value)} />
            </div>
          )}

          {isFood && (
            <>
              <ToggleBtns label="FSSAI License (Food Safety)" stateKey="fssaiApplicable" value={comp.fssaiApplicable} />
              {comp.fssaiApplicable === true && (
                <Inp label="FSSAI License Number" placeholder="10020122003817" value={comp.fssaiLicense} onChange={e => set("fssaiLicense", e.target.value)} />
              )}
            </>
          )}

          <div>
            <label style={{ ...s.label, marginBottom: 10 }}>Business Policies (optional)</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Inp label="Return / Refund Policy URL" placeholder="https://yourbusiness.com/returns" value={comp.returnPolicy} onChange={e => set("returnPolicy", e.target.value)} />
              <Inp label="Privacy Policy URL"         placeholder="https://yourbusiness.com/privacy" value={comp.privacyPolicy} onChange={e => set("privacyPolicy", e.target.value)} />
            </div>
          </div>
        </div>
      </div>
      <NavButtons onBack={onBack} onNext={() => onNext(comp)} loading={saving} nextLabel="Review & Confirm" />
    </div>
  );
}

// ════════════════════════════════════════════════════════════

// STEP 8 — REVIEW & CONFIRM
// ════════════════════════════════════════════════════════════
function StepReview({ summary, form, onConfirm, onBack, saving }) {
  const [agreed, setAgreed] = useState(false);
  const { business, locations, channels, pos, compliance, financial } = summary || {};
  const Row = ({ label, value, ok }) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--q-border)" }}>
      <span style={{ fontSize: "0.875rem", color: "var(--q-text-3)" }}>{label}</span>
      <span style={{ fontSize: "0.875rem", fontWeight: 600, color: ok ? "#059669" : "var(--q-text-1)" }}>
        {ok ? "✓ " : ""}{value || "—"}
      </span>
    </div>
  );

  return (
    <div className="q-fade-in" style={{ maxWidth: 680, margin: "0 auto" }}>
      <StepHeader icon={Eye} title="Review Your Data" desc="Review your business setup before analysis begins. You can go back and edit." />

      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
        <div style={s.card}>
          <h3 style={{ fontWeight: 700, marginBottom: 14, fontSize: "1rem" }}>🏢 Business</h3>
          <Row label="Business Name" value={business?.businessName} ok={!!business?.businessName} />
          <Row label="Industry" value={business?.industry} />
          <Row label="Business Type" value={BUSINESS_TYPES.find(b => b.id === business?.businessType)?.label} />
          <Row label="Operating Model" value={business?.operatingModel?.replace("_", " ")} />
          <Row label="Country" value={business?.country} ok={!!business?.country} />
          <Row label="Currency" value={business?.currency} />
          <Row label="Website" value={business?.website} />
        </div>

        <div style={s.card}>
          <h3 style={{ fontWeight: 700, marginBottom: 14, fontSize: "1rem" }}>📍 Locations & Channels</h3>
          <Row label="Physical Stores" value={locations?.length ? `${locations.length} store(s)` : "None"} ok={locations?.length > 0} />
          <Row label="Sales Channels" value={channels?.length ? `${channels.length} channel(s)` : "None"} ok={channels?.length > 0} />
          <Row label="POS System" value={pos?.length ? pos[0].provider || "Configured" : "None"} ok={pos?.length > 0} />
        </div>

        <div style={s.card}>
          <h3 style={{ fontWeight: 700, marginBottom: 14, fontSize: "1rem" }}>💰 Financial Data</h3>
          <Row label="Financial Records" value={financial?.length ? `${financial.length} period(s)` : "Not provided"} ok={financial?.length > 0} />
          <Row label="Uploaded File" value={business?.uploadedFile ? "Yes ✓" : "None"} ok={!!business?.uploadedFile} />
          <Row label="GST Registered" value={compliance?.gstRegistered === true ? "Yes" : compliance?.gstRegistered === false ? "No" : "Not specified"} />
        </div>
      </div>

      {/* Confirmation checkbox */}
      <div style={{ ...s.card, background: "#FFFBEB", border: "1.5px solid #FDE68A" }}>
        <div style={s.checkRow(agreed)} onClick={() => setAgreed(a => !a)}>
          <div style={{ width: 20, height: 20, borderRadius: 5, border: `2px solid ${agreed ? "#2563EB" : "var(--q-border)"}`, background: agreed ? "#2563EB" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {agreed && <Check size={12} color="#fff" strokeWidth={3} />}
          </div>
          <span style={{ fontSize: "0.9rem", color: "var(--q-text-1)", lineHeight: 1.5 }}>
            I confirm that the information and uploaded data are accurate to the best of my knowledge.
          </span>
        </div>
      </div>

      <NavButtons onBack={onBack} onNext={onConfirm} disabled={!agreed} loading={saving} nextLabel="Confirm & Analyze →" />
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// STEP 9 — READY
// ════════════════════════════════════════════════════════════
function StepReady({ bizName, onGo }) {
  return (
    <div className="q-fade-in" style={{ maxWidth: 480, margin: "0 auto", textAlign: "center" }}>
      <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,#8B1A1A,#C0392B)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", boxShadow: "0 8px 32px #8B1A1A30" }}>
        <Sparkles size={36} color="#fff" />
      </div>
      <h2 style={{ fontSize: "1.875rem", fontWeight: 800, marginBottom: 14 }}>{bizName || "Your business"} is ready!</h2>
      <p style={{ color: "var(--q-text-3)", fontSize: "1.0625rem", lineHeight: 1.7, marginBottom: 36 }}>
        Quantora has set up your workspace. Your business intelligence dashboard is ready to explore.
      </p>
      <button onClick={onGo} className="q-btn q-btn-primary" style={{ gap: 8, padding: "14px 32px", fontSize: "1.0625rem" }}>
        Open My Dashboard <ArrowRight size={18} />
      </button>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// MAIN ONBOARDING PAGE
// ════════════════════════════════════════════════════════════
export default function OnboardingPage() {
  const router = useRouter();
  const { enterDemoMode, addBusiness, fetchBusinesses } = useBusiness();

  // State
  const [step, setStep] = useState(0);
  const [path, setPath] = useState(null);
  const [businessId, setBusinessId] = useState(null);
  const [form, setForm] = useState({});
  const [summary, setSummary] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Derive which optional steps to show based on businessType + operatingModel
  const cfg = STEP_CONFIG[form.businessType] || {};
  const showStores = cfg.showStores || form.operatingModel === "offline_only" || form.operatingModel === "hybrid";
  const showOnline = cfg.showOnline || form.operatingModel === "online_only" || form.operatingModel === "hybrid";
  const showPOS = cfg.showPOS;
  const showInventory = cfg.showInventory;

  // Build visible step list
  const WIZARD_STEPS = [
    { label: "Details", key: "details" },
    { label: "Model", key: "model" },
    { label: "Channels", key: "channels" },
    ...(showStores ? [{ label: "Stores", key: "stores" }] : []),
    ...(showPOS ? [{ label: "POS", key: "pos" }] : []),
    { label: "Finances", key: "finances" },
    { label: "Compliance", key: "compliance" },
    { label: "Review", key: "review" },
  ];

  const curKey = step === 0 ? "path" : WIZARD_STEPS[step - 1]?.key;

  const api = async (fn) => {
    setSaving(true); setError("");
    try { await fn(); }
    catch (e) { setError(e.response?.data?.message || e.message || "Something went wrong"); }
    finally { setSaving(false); }
  };

  // ── Path selection ───────────────────────────────────────
  const handleChoice = (choice) => {
    setPath(choice);
    if (choice === "demo") { enterDemoMode(); router.push("/dashboard"); return; }
    if (choice === "idea") { router.push("/idea-flow"); return; }
    setStep(1);
  };

  // ── Step 1: Business Details ──────────────────────────────
  const handleDetails = async (data) => {
    await api(async () => {
      const res = await API.post("/onboarding/start", {
        businessName: data.businessName,
        industry: data.industry,
        businessType: data.businessType,
        businessModel: data.businessModel,
        stage: data.stage,
        country: data.country,
        state: data.state,
        city: data.city,
        pincode: data.pincode,
        currency: data.currency?.split(" — ")[0] || "USD",
        website: data.website,
        description: data.description,
        employeeCount: data.employeeCount,
      });
      const biz = res.data?.business || res.data;
      setBusinessId(biz.id);
      setForm(f => ({ ...f, ...data, businessId: biz.id }));
      addBusiness(biz);
      setStep(2);
    });
  };

  // ── Step 2: Operating model ───────────────────────────────
  const handleOperatingModel = async (model) => {
    await api(async () => {
      await API.patch(`/onboarding/${businessId}/operating-model`, { operatingModel: model });
      setForm(f => ({ ...f, operatingModel: model }));
      setStep(3);
    });
  };

  // ── Step 3: Sales channels ────────────────────────────────
  const handleChannels = async (channels) => {
    await api(async () => {
      await API.post(`/onboarding/${businessId}/channels`, { channels });
      setStep(4);
    });
  };

  // ── Step 4+: Dynamic optional steps ──────────────────────
  const handleStores = async (locations) => {
    await api(async () => {
      await API.post(`/onboarding/${businessId}/locations`, { locations });
      setStep(s => s + 1);
    });
  };

  const handlePOS = async (pos) => {
    await api(async () => {
      if (pos) await API.post(`/onboarding/${businessId}/pos`, pos);
      setStep(s => s + 1);
    });
  };

  const handleFinancial = async (records) => {
    await api(async () => {
      if (records.length > 0) await API.post(`/onboarding/${businessId}/financial-history`, { records });
      setStep(s => s + 1);
    });
  };

  const handleCompliance = async (comp) => {
    await api(async () => {
      await API.post(`/onboarding/${businessId}/compliance`, comp);
      // Fetch summary for review
      const res = await API.get(`/onboarding/${businessId}/summary`);
      setSummary(res.data);
      setStep(s => s + 1);
    });
  };

  const handleConfirm = async () => {
    await api(async () => {
      await API.post(`/api/onboarding/${businessId}/confirm`);
      await fetchBusinesses();
      setStep(s => s + 1);
    });
  };

  const goBack = () => setStep(s => Math.max(s - 1, step === 1 ? 0 : 1));

  // ── Render ────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div style={{ minHeight: "100vh", background: "var(--q-bg)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", padding: "48px 24px 80px" }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: step > 0 && step < WIZARD_STEPS.length + 2 ? 36 : 56 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#8B1A1A,#C0392B)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Sparkles size={18} color="#fff" />
        </div>
        <span style={{ fontWeight: 800, fontSize: "1.25rem", color: "var(--q-text-1)" }}>Quantora</span>
      </div>

      {/* Progress bar (only during wizard steps 1–8) */}
      {step >= 1 && step <= WIZARD_STEPS.length && (
        <WizardProgress steps={WIZARD_STEPS} current={step - 1} />
      )}

      {/* Error banner */}
      {error && (
        <div style={{ maxWidth: 680, width: "100%", marginBottom: 20, padding: "12px 16px", background: "var(--q-danger-bg)", border: "1px solid var(--q-danger-border)", borderRadius: 10, display: "flex", gap: 10, alignItems: "center" }}>
          <AlertCircle size={16} color="var(--q-danger)" />
          <span style={{ fontSize: "0.875rem", color: "var(--q-danger)" }}>{error}</span>
        </div>
      )}

      {/* ── Step Renderer ── */}
      {step === 0 && <ChoosePath onChoice={handleChoice} />}

      {step >= 1 && (() => {
        const key = WIZARD_STEPS[step - 1]?.key;
        switch (key) {
          case "details": return <StepBusinessDetails onNext={handleDetails} onBack={() => setStep(0)} saving={saving} />;
          case "model": return <StepOperatingModel form={form} onNext={handleOperatingModel} onBack={goBack} saving={saving} />;
          case "channels": return <StepSalesChannels form={form} onNext={handleChannels} onBack={goBack} saving={saving} />;
          case "stores": return <StepStoreLocations form={form} onNext={handleStores} onBack={goBack} saving={saving} />;
          case "pos": return <StepPOS onNext={handlePOS} onBack={goBack} saving={saving} />;
          case "finances": return <StepFinancialHistory form={form} onNext={handleFinancial} onBack={goBack} saving={saving} />;
          case "compliance": return <StepCompliance form={form} onNext={handleCompliance} onBack={goBack} saving={saving} />;
          case "review": return <StepReview summary={summary} form={form} onConfirm={handleConfirm} onBack={goBack} saving={saving} />;
          default: return null;
        }
      })()}

      {/* Ready screen */}
      {step === WIZARD_STEPS.length + 1 && (
        <StepReady bizName={form.businessName} onGo={() => router.push("/dashboard")} />
      )}
    </div>
    </>
  );
}
