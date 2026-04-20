import { Briefcase, FileText, Settings, ShieldCheck } from "lucide-react";

export const BUSINESS_TYPES = [
  {
    id: "restaurant",
    name: "Start a Restaurant",
    icon: "Utensils",
    description: "Launch a full-service food and beverage establishment.",
    licenses: ["trade-license", "fire-license", "vat-registration"],
    costEstimate: "BDT 85,000 - 1,50,000",
    timeFrame: "15 - 30 days"
  },
  {
    id: "garments",
    name: "Start a Garments Factory",
    icon: "Shirt",
    description: "Set up a RMG manufacturing unit for export.",
    licenses: ["trade-license", "irc", "erc", "fire-license", "env-clearance", "bgmea"],
    costEstimate: "BDT 3,00,000 - 5,00,000",
    timeFrame: "30 - 60 days"
  },
  {
    id: "software",
    name: "Start an IT / Software Company",
    icon: "Laptop",
    description: "Build an agency or product company with global clients.",
    licenses: ["trade-license", "tin", "basis"],
    costEstimate: "BDT 50,000 - 80,000",
    timeFrame: "10 - 15 days"
  },
  {
    id: "import-export",
    name: "Start an Export-Import Business",
    icon: "Ship",
    description: "Trade goods internationally from Bangladesh.",
    licenses: ["trade-license", "irc", "erc", "tin"],
    costEstimate: "BDT 1,20,000 - 2,00,000",
    timeFrame: "20 - 40 days"
  }
];

export const LICENSES = [
  {
    id: "trade-license",
    name: "Trade License (Commercial)",
    category: "Trading",
    authority: "City Corporation / Pouroshova / Union Parishad",
    description: "The fundamental permission required to conduct any commercial business in Bangladesh. It legally registers your business entity with the local government.",
    documents: [
      "National ID (NID) of the proprietor/MD",
      "Rent Agreement of the office/business premise",
      "3 Copies of Passport Size Photo",
      "Memorandum of Association (for limited companies)"
    ],
    processSteps: [
      "Collect the specific form from the Zonal Office.",
      "Fill out the form and attach requisite documents.",
      "Pay the fees at the designated bank.",
      "Submit to the License Supervisor for verification."
    ],
    fees: "BDT 5,000 - 15,000 (varies greatly by zone and business type)",
    timeRequired: "3 - 5 Working Days",
    dependencies: ["None"],
    renewable: "Annually",
    legalBasis: "Local Government (City Corporation) Act, 2009"
  },
  {
    id: "irc",
    name: "Import Registration Certificate (IRC)",
    category: "Export-Import",
    authority: "Office of the Chief Controller of Imports and Exports (CCI&E)",
    description: "Mandatory certificate allowing a company to import goods and machinery into Bangladesh.",
    documents: [
      "Valid Trade License",
      "e-TIN Certificate",
      "VAT Registration Certificate (BIN)",
      "Bank Solvency Certificate"
    ],
    processSteps: [
      "Register on the OLM (Online Licensing Module) portal.",
      "Upload all scanned documents.",
      "Pay the fees online.",
      "Receive digital IRC certificate."
    ],
    fees: "BDT 5,000 - 60,000 (based on import ceiling)",
    timeRequired: "5 - 7 Working Days",
    dependencies: ["Trade License", "TIN", "Bank Account"],
    renewable: "Annually",
    legalBasis: "Imports and Exports (Control) Act, 1950"
  },
  {
    id: "erc",
    name: "Export Registration Certificate (ERC)",
    category: "Export-Import",
    authority: "Office of the Chief Controller of Imports and Exports (CCI&E)",
    description: "Mandatory certificate allowing a company to export goods from Bangladesh.",
    documents: [
      "Valid Trade License",
      "e-TIN Certificate",
      "VAT Registration Certificate (BIN)",
      "Bank Solvency Certificate"
    ],
    processSteps: [
      "Register on the OLM (Online Licensing Module) portal.",
      "Upload all scanned documents.",
      "Pay the fees online.",
      "Receive digital ERC certificate."
    ],
    fees: "BDT 7,000 (Initial Registration)",
    timeRequired: "5 - 7 Working Days",
    dependencies: ["Trade License", "TIN", "Bank Account"],
    renewable: "Annually",
    legalBasis: "Imports and Exports (Control) Act, 1950"
  },
  {
    id: "fire-license",
    name: "Fire License",
    category: "Safety & Standards",
    authority: "Fire Service and Civil Defense (FSCD)",
    description: "A safety compliance certificate ensuring the commercial building or factory meets national fire safety standards.",
    documents: [
      "Trade License",
      "Building Layout Plan",
      "Deed of Agreement / Rent Receipt",
      "No Objection Certificate (NOC) from local authority"
    ],
    processSteps: [
      "Submit application to FSCD inspector.",
      "Inspector visits the premise to check safety measures.",
      "Deposit the required fees upon approval.",
      "Certificate is issued."
    ],
    fees: "BDT 3,000 - 15,000",
    timeRequired: "15 - 30 Working Days",
    dependencies: ["Trade License"],
    renewable: "Annually",
    legalBasis: "Fire Prevention and Extinction Act, 2003"
  }
];
