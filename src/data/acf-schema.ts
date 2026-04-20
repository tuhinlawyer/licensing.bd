/**
 * MASTER BLUEPRINT: ACF SCHEMA DEFINITIONS
 * 
 * Since this environment runs React/Node, you can use this schema reference 
 * when you recreate these fields in Advanced Custom Fields (ACF) Pro on your WordPress host.
 * 
 * Instructions for WordPress Setup:
 * 1. Install 'Custom Post Type UI' and create two post types: 'license' and 'business_type'
 * 2. Install 'ACF Pro' and import or recreate the fields below.
 */

export const ACFLicenseSchema = [
  {
    name: "license_name_en",
    label: "License Name (English)",
    type: "text",
    required: true,
  },
  {
    name: "license_name_bn",
    label: "License Name (Bangla)",
    type: "text",
    required: false,
  },
  {
    name: "issuing_authority",
    label: "Issuing Authority",
    type: "text",
    instructions: "e.g., Dhaka North City Corporation",
  },
  {
    name: "authority_website",
    label: "Authority Website",
    type: "url",
  },
  {
    name: "description_en",
    label: "Description (English)",
    type: "textarea",
    instructions: "Plain English summary, 150-200 words",
  },
  {
    name: "who_needs_it_en",
    label: "Who Needs It?",
    type: "textarea",
  },
  {
    name: "why_needed_en",
    label: "Why is it Needed?",
    type: "textarea",
    instructions: "Legal consequence of not having this license.",
  },
  {
    name: "documents_list",
    label: "Documents Required",
    type: "repeater",
    sub_fields: [
      { name: "document_en", label: "Document Name", type: "text" },
      { name: "is_mandatory", label: "Mandatory?", type: "true_false" }
    ]
  },
  {
    name: "process_steps",
    label: "Process Steps",
    type: "repeater",
    sub_fields: [
      { name: "step_title_en", label: "Step Title", type: "text" },
      { name: "step_desc_en", label: "Step Description", type: "textarea" },
      { name: "responsible_party", label: "Responsible", type: "text", instructions: "Applicant or Authority" }
    ]
  },
  {
    name: "fee_govt_min",
    label: "Govt Fee Min (BDT)",
    type: "number",
  },
  {
    name: "fee_govt_max",
    label: "Govt Fee Max (BDT)",
    type: "number",
  },
  {
    name: "processing_days_min",
    label: "Processing Time Min (Days)",
    type: "number",
  },
  {
    name: "processing_days_max",
    label: "Processing Time Max (Days)",
    type: "number",
  },
  {
    name: "dependencies",
    label: "Required Before This (Dependencies)",
    type: "relationship",
    instructions: "Select other licenses required before getting this one to build the compliance graph.",
    post_type: ["license"]
  },
  {
    name: "difficulty_level",
    label: "Difficulty Level",
    type: "select",
    choices: ["Easy", "Medium", "Complex"]
  },
  {
    name: "legal_basis",
    label: "Legal Basis (Act / Rule / Regulation)",
    type: "group",
    sub_fields: [
      { name: "legal_basis_en", label: "Legal Basis (English)", type: "textarea", instructions: "e.g., 'Required under City Corporation Taxation Rules, 2009.'" },
      { name: "legal_basis_bn", label: "Legal Basis (Bangla)", type: "textarea" }
    ]
  },
  {
    name: "foreign_investor_apply",
    label: "Applies to Foreign Investors",
    type: "true_false"
  }
];

export const ACFBusinessTypeSchema = [
  {
    name: "business_name_en",
    label: "Business Name (English)",
    type: "text",
    required: true,
  },
  {
    name: "industry_category",
    label: "Industry Category",
    type: "taxonomy",
  },
  {
    name: "description_en",
    label: "Description (English)",
    type: "textarea",
  },
  {
    name: "required_licenses",
    label: "Required Licenses",
    type: "relationship",
    post_type: ["license"],
    instructions: "Link the required licenses to automatically build the setup roadmap."
  },
  {
    name: "estimated_total_min",
    label: "Estimated Total Cost Min (BDT)",
    type: "number"
  },
  {
    name: "estimated_total_max",
    label: "Estimated Total Cost Max (BDT)",
    type: "number"
  },
  {
    name: "is_foreign_applicable",
    label: "Allows Foreign Ownership?",
    type: "true_false"
  },
  {
    name: "insights_and_mistakes",
    label: "Compliance Insights",
    type: "group",
    sub_fields: [
      { 
        name: "common_mistakes_en", 
        label: "Common Mistakes (English)", 
        type: "repeater",
        sub_fields: [{ name: "mistake_en", label: "Mistake & Solution", type: "textarea" }]
      },
      { 
        name: "common_mistakes_bn", 
        label: "Common Mistakes (Bangla)", 
        type: "repeater",
        sub_fields: [{ name: "mistake_bn", label: "Mistake & Solution", type: "textarea" }]
      }
    ]
  },
  {
    name: "saas_integration",
    label: "SaaS & Notification Triggers (Phase 2/3)",
    type: "group",
    instructions: "Metadata strictly used by the future SaaS engine to trigger automated alerts and reminders.",
    sub_fields: [
      { name: "renewal_cycle_days", label: "Renewal Cycle (Days)", type: "number", instructions: "e.g., 365 for annual." },
      { name: "reminder_offset_days", label: "First Warning (Days Before Expiry)", type: "number", default_value: 30 },
      { name: "has_late_fine", label: "Has Late Fine?", type: "true_false" },
      { name: "renewal_fee_bdt", label: "Fixed Renewal Fee (BDT)", type: "number", instructions: "Leave 0 if variable." }
    ]
  }
];
