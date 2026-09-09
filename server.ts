import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Helper to get Gemini Client lazily with required User-Agent
function getGeminiClient(customKey?: string): GoogleGenAI | null {
  const apiKey = customKey || process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Resilient helper to call Gemini with multi-model fallback and overload handling
async function generateGeminiContentWithFallback(
  geminiClient: GoogleGenAI,
  prompt: string,
  config?: any
): Promise<{ text: string; model: string } | null> {
  // Supported valid models per GenAI skill: primary -> alias -> flash-lite
  const candidateModels = ["gemini-3.7-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];
  
  for (const modelName of candidateModels) {
    try {
      const response = await geminiClient.models.generateContent({
        model: modelName,
        contents: prompt,
        config: config || { temperature: 0.5 },
      });
      if (response && typeof response.text === 'string' && response.text.trim()) {
        return { text: response.text, model: modelName };
      }
    } catch (err: any) {
      const status = err?.status || err?.code || (err?.message?.includes('503') ? 503 : undefined);
      console.log(`Model [${modelName}] temporarily unavailable (status: ${status || 'err'}). Trying next model...`);
    }
  }
  return null;
}

// Helper function to detect medicine/prescription/doctor treatment advice requests
function checkMedicineOrDoctorAdvice(message: string): { isAdvised: boolean; matched: string[] } {
  const lower = message.toLowerCase();
  const patterns = [
    /\b(prescribe|prescription|medicine|medicines|medication|medications|tablet|tablets|capsule|capsules|syrup|injection|dosage|dose|mg|ml|cure|treatment for|cure for|remedy for|treat my|what should i take|which medicine|which drug|recommend a drug|antibiotic|antibiotics|painkiller|pain killer|paracetamol|crocin|dolo|azithromycin|amoxicillin|metformin|insulin dose|pantoprazole|atorvastatin|thyronorm dose|telmisartan|cough syrup)\b/i,
    /\b(how many (mg|pills|tablets)|can i take|should i take|is it safe to take|give me medicine|doctor advise|doctor advice|treat me|diagnose me)\b/i,
    /\b(how to cure|how to treat|home remedy for infection|what to drink for fever|medicine for fever|medicine for cold|medicine for diabetes|medicine for thyroid|medicine for cholesterol)\b/i
  ];
  const matchedTerms: string[] = [];
  for (const pat of patterns) {
    const match = lower.match(pat);
    if (match) {
      matchedTerms.push(match[0]);
    }
  }
  return { isAdvised: matchedTerms.length > 0, matched: matchedTerms };
}

// Helper to check if query is completely off-topic outside Microcells Diagnostics
function checkOffTopicQuery(message: string): boolean {
  const lower = message.toLowerCase();
  const offTopicPatterns = [
    /\b(write code|python|javascript|react|html|css|sql|programming|debug|algorithm|coding)\b/i,
    /\b(president of|capital of|who is prime minister|who won|world cup|cricket score|movie review|netflix|song lyrics|poem|joke|story about|astrology|horoscope|crypto|bitcoin|ethereum|stock market|share price)\b/i,
    /\b(recipe for|how to cook|bake a cake|restaurant in|flight to|hotel in|weather in|car repair|plumbing)\b/i,
    /\b(competitor|lal path|thyrocare|dr lal|metropolis|apollo clinic|srl diagnostics|suburban diagnostics)\b/i
  ];
  for (const pat of offTopicPatterns) {
    if (pat.test(lower)) return true;
  }
  return false;
}

// Built-in Medical Pathology Knowledge Base for instant high-quality clinical test guidance
const PATHOLOGY_KNOWLEDGE: Record<string, {
  summary: string;
  sample: string;
  fasting: string;
  tat: string;
  clinicalSignificance: string[];
  normalRange: string;
  precautions: string[];
}> = {
  "cbc": {
    summary: "Complete Blood Count (CBC) assesses overall health and detects a wide range of disorders including anemia, infections, leukemia, and platelet/clotting issues.",
    sample: "Whole Blood (EDTA Tube - Purple Top)",
    fasting: "Fasting not strictly required, but light fasting (2-4 hrs) recommended.",
    tat: "4 - 6 Hours (Same Day)",
    clinicalSignificance: [
      "Hemoglobin & RBC count to diagnose anemia or polycythemia",
      "White Blood Cell (WBC) count and differential to evaluate infections or immune disorders",
      "Platelet count for bleeding/clotting risk assessment",
      "MCV, MCH, MCHC, RDW indices for red cell morphological typing"
    ],
    normalRange: "Hb: 13.0-17.0 g/dL (M) / 12.0-15.0 g/dL (F); WBC: 4,000-11,000 /mcL; Platelets: 1.5-4.5 Lakhs/mcL",
    precautions: ["Avoid vigorous exercise right before blood draw", "Stay well hydrated"]
  },
  "lipid": {
    summary: "Lipid Profile measures total cholesterol, HDL (good), LDL (bad), VLDL, and Triglycerides to evaluate cardiovascular disease, atherosclerosis, and stroke risk.",
    sample: "Serum (SST Tube - Gold/Yellow Top)",
    fasting: "Strict 10-12 hours overnight fasting mandatory. Only plain water permitted.",
    tat: "6 - 8 Hours (Same Day)",
    clinicalSignificance: [
      "Assesses coronary artery disease and heart attack risk",
      "Monitors response to cholesterol-lowering statin therapy",
      "Detects familial hypercholesterolemia and metabolic syndrome"
    ],
    normalRange: "Total Cholesterol: <200 mg/dL; HDL: >40 mg/dL (M), >50 mg/dL (F); LDL: <100 mg/dL; Triglycerides: <150 mg/dL",
    precautions: ["No alcohol or heavy fatty meals for 24 hours prior", "Do not skip fasting period"]
  },
  "hba1c": {
    summary: "Glycated Hemoglobin (HbA1c) reflects average blood glucose levels over the preceding 2 to 3 months (8-12 weeks), providing the gold standard for diabetes diagnosis and monitoring.",
    sample: "Whole Blood (EDTA Tube - Purple Top)",
    fasting: "No fasting required. Can be done anytime of the day.",
    tat: "4 - 6 Hours (Same Day)",
    clinicalSignificance: [
      "Normal: Below 5.7%",
      "Prediabetes: 5.7% to 6.4%",
      "Diabetes: 6.5% or higher",
      "Therapeutic target for most diabetic adults: Under 7.0%"
    ],
    normalRange: "< 5.7% (Normal Non-Diabetic)",
    precautions: ["Inform lab if you have recent blood transfusions or hemoglobinopathies"]
  },
  "thyroid": {
    summary: "Thyroid Profile (T3, T4, TSH) evaluates the metabolic regulatory function of the thyroid gland, identifying hypothyroidism (underactive) or hyperthyroidism (overactive).",
    sample: "Serum (SST Tube - Gold/Yellow Top)",
    fasting: "Fasting 8-10 hours preferred (early morning sample recommended due to TSH circadian peak).",
    tat: "6 - 8 Hours (Same Day)",
    clinicalSignificance: [
      "High TSH with low T3/T4 indicates primary Hypothyroidism (weight gain, fatigue, cold intolerance, hair fall)",
      "Low TSH with high T3/T4 indicates Hyperthyroidism (weight loss, tremors, rapid heartbeat, heat intolerance)",
      "Essential for pregnancy screening and medication dosage adjustment"
    ],
    normalRange: "TSH: 0.35 - 4.94 uIU/mL; Total T3: 0.8 - 2.0 ng/mL; Total T4: 5.1 - 14.1 ug/dL",
    precautions: ["Take daily thyroid medicine (e.g. Thyronorm) AFTER blood collection, not before, unless doctor specified"]
  },
  "lft": {
    summary: "Liver Function Test (LFT) assesses hepatic health, enzyme levels (SGOT, SGPT, ALP), bilirubin (direct/indirect), and proteins (Albumin, Globulin) to detect liver inflammation, jaundice, or damage.",
    sample: "Serum (SST Tube - Gold/Yellow Top)",
    fasting: "8 - 10 hours overnight fasting recommended.",
    tat: "6 - 8 Hours (Same Day)",
    clinicalSignificance: [
      "Elevated SGPT/SGOT indicates liver cell injury (fatty liver, hepatitis, medication toxicity)",
      "Elevated Bilirubin explains jaundice and biliary obstruction",
      "Alkaline Phosphatase (ALP) & GGT indicate bile duct or bone conditions"
    ],
    normalRange: "SGPT/ALT: <45 U/L; SGOT/AST: <40 U/L; Total Bilirubin: 0.2-1.2 mg/dL; Albumin: 3.5-5.2 g/dL",
    precautions: ["Avoid alcohol consumption for 48 hours before the test"]
  },
  "kft": {
    summary: "Kidney Function Test (KFT / RFT) measures Urea, BUN, Creatinine, Uric Acid, and Electrolytes to assess renal filtration, glomerulus efficiency, and hydration status.",
    sample: "Serum (SST Tube - Gold/Yellow Top)",
    fasting: "Fasting 8-10 hours recommended. Avoid heavy meat intake the evening before.",
    tat: "6 - 8 Hours (Same Day)",
    clinicalSignificance: [
      "Serum Creatinine & eGFR provide direct measurement of kidney filtration rate",
      "Blood Urea Nitrogen (BUN) indicates protein breakdown and renal clearance",
      "Uric Acid detects hyperuricemia and Gout risk"
    ],
    normalRange: "Serum Creatinine: 0.6-1.2 mg/dL (M) / 0.5-1.0 mg/dL (F); Blood Urea: 15-40 mg/dL; Uric Acid: 3.5-7.2 mg/dL",
    precautions: ["Drink adequate water unless on medically restricted fluid intake"]
  },
  "vitamin d": {
    summary: "25-Hydroxy Vitamin D test evaluates bone mineral density support, calcium absorption, immune resilience, and unexplained muscle/joint aches or fatigue.",
    sample: "Serum (SST Tube - Gold/Yellow Top)",
    fasting: "No special fasting required.",
    tat: "Same Day (6 - 8 Hours)",
    clinicalSignificance: [
      "Deficiency (<20 ng/mL) causes osteopenia, osteoporosis, rickets, muscle weakness, and fatigue",
      "Insufficiency: 20-30 ng/mL",
      "Sufficiency: 30-100 ng/mL"
    ],
    normalRange: "30 - 100 ng/mL (Optimal)",
    precautions: ["Note if you are taking high-dose weekly cholecalciferol supplements"]
  },
  "vitamin b12": {
    summary: "Vitamin B12 (Cyanocobalamin) is crucial for red blood cell formation, neurological nerve health, cognitive sharpness, and cellular DNA synthesis.",
    sample: "Serum (SST Tube - Gold/Yellow Top)",
    fasting: "8 - 10 hours overnight fasting preferred.",
    tat: "Same Day (6 - 8 Hours)",
    clinicalSignificance: [
      "Deficiency leads to megaloblastic anemia, peripheral neuropathy (tingling in hands/feet), fatigue, and memory fog",
      "Common among strict vegetarians/vegans and individuals on prolonged Metformin or antacid therapy"
    ],
    normalRange: "211 - 911 pg/mL",
    precautions: ["Inform lab if taking B-complex supplements or B12 injections"]
  },
  "urine": {
    summary: "Urine Routine & Microscopic Examination (Urine R/M) screens for urinary tract infections (UTI), proteinuria (kidney distress), glucosuria (diabetes), hematuria (microscopic blood), and crystals/casts.",
    sample: "Clean-catch midstream urine in a sterile container (First morning sample preferred)",
    fasting: "No fasting needed. First morning void is most concentrated and ideal.",
    tat: "2 - 4 Hours (Same Day)",
    clinicalSignificance: [
      "Pus cells / Leuko-esterase indicate active urinary tract infection",
      "Protein/Albumin indicates renal filtration permeability",
      "Microscopic RBCs screen for stones, infection, or glomerulopathy"
    ],
    normalRange: "Proteins: Nil; Sugar: Nil; Pus cells: 0-4 /hpf; RBCs: Nil-2 /hpf",
    precautions: ["Collect mid-stream urine (discard initial stream, collect middle part)"]
  }
};

// Fallback intelligent diagnostic text generator with strict guardrails
function generateLocalPathologyResponse(
  message: string,
  testsCatalog: any[] = [],
  packagesCatalog: any[] = [],
  labInfo: any = {}
): { 
  text: string; 
  suggestedTests: any[]; 
  isMedicalOrDrugAdvised?: boolean;
  isOffTopicBlocked?: boolean;
  showContactCard?: boolean;
  contactDeskInfo?: any;
} {
  const lower = message.toLowerCase();
  const matchedTests: any[] = [];
  const matchedPackages: any[] = [];

  const contactDesk = {
    phone: labInfo.phone || "+91 98765 43210",
    whatsapp: labInfo.whatsappNumber || "+919876543210",
    email: labInfo.email || "contact@microcellsdiagnostics.com",
    emergency: labInfo.emergencyContact || "+91 98765 43211"
  };

  // 1. Guardrail Check: Medicine / Prescription / Doctor Advice Request
  const medCheck = checkMedicineOrDoctorAdvice(message);
  if (medCheck.isAdvised) {
    // Find relevant diagnostic tests that might be associated with symptoms or diseases mentioned
    let relevantTests = testsCatalog.filter(t => 
      lower.includes(t.name.toLowerCase()) ||
      (t.healthConcern && lower.includes(t.healthConcern.toLowerCase())) ||
      (t.category && lower.includes(t.category.toLowerCase()))
    ).slice(0, 3);

    if (relevantTests.length === 0) {
      if (lower.includes('fever') || lower.includes('infection') || lower.includes('cough')) {
        relevantTests = testsCatalog.filter(t => t.name.toLowerCase().includes('cbc') || t.name.toLowerCase().includes('crp') || t.name.toLowerCase().includes('widal')).slice(0, 3);
      } else if (lower.includes('sugar') || lower.includes('diabetes') || lower.includes('metformin') || lower.includes('insulin')) {
        relevantTests = testsCatalog.filter(t => t.name.toLowerCase().includes('glucose') || t.name.toLowerCase().includes('hba1c')).slice(0, 3);
      } else if (lower.includes('cholesterol') || lower.includes('statin') || lower.includes('atorvastatin') || lower.includes('heart') || lower.includes('bp')) {
        relevantTests = testsCatalog.filter(t => t.name.toLowerCase().includes('lipid') || t.name.toLowerCase().includes('kft')).slice(0, 3);
      } else if (lower.includes('thyroid') || lower.includes('thyronorm') || lower.includes('weight')) {
        relevantTests = testsCatalog.filter(t => t.name.toLowerCase().includes('thyroid') || t.name.toLowerCase().includes('tsh')).slice(0, 3);
      }
    }

    const testChips = relevantTests.map(t => ({
      id: t.id,
      name: t.name,
      code: t.code,
      price: t.price,
      sampleType: t.sampleType,
      fastingRequired: t.fastingRequired,
      type: 'test'
    }));

    const replyText = `⚠️ **Medical & Prescription Advisory Notice**\n\n` +
      `As an AI Clinical Assistant representing **Microcells Diagnostics**, I am strictly prohibited from prescribing medicines, recommending specific drug names (e.g. antibiotics, painkillers), or modifying medication dosages.\n\n` +
      `**Clinical Safety Protocol:**\n` +
      `• Medication prescriptions and therapeutic plans must always be evaluated and prescribed by a **registered medical practitioner / treating physician**.\n` +
      `• Our pathology laboratory provides certified diagnostic blood & urine tests to help your doctor accurately assess clinical parameters before prescribing treatment.\n\n` +
      `📞 **Contact Microcells Medical Helpdesk:**\n` +
      `• Direct Helpline: **${contactDesk.phone}**\n` +
      `• WhatsApp Medical Desk: **${contactDesk.whatsapp}**\n` +
      `• Emergency Line: **${contactDesk.emergency}**\n\n` +
      `Below are the relevant diagnostic tests that clinicians typically order to evaluate these symptoms:`;

    return {
      text: replyText,
      suggestedTests: testChips,
      isMedicalOrDrugAdvised: true,
      showContactCard: true,
      contactDeskInfo: contactDesk
    };
  }

  // 2. Guardrail Check: Off-Topic / External Knowledge Request
  if (checkOffTopicQuery(message)) {
    return {
      text: `🛡️ **Microcells Diagnostics AI Scope Limitation**\n\n` +
        `I am the dedicated AI Diagnostic Assistant for **Microcells Diagnostics Pvt. Ltd.**\n\n` +
        `To ensure high clinical precision and safety, I am strictly sandboxed to assist with **Microcells pathology tests, health checkup packages, sample collection rules, fasting guidelines, lab timings, branches, and report downloads**.\n\n` +
        `I cannot provide general trivia, coding solutions, entertainment commentary, or external non-diagnostic data.\n\n` +
        `How may I assist you with your diagnostic blood tests or health checkups today?`,
      suggestedTests: testsCatalog.slice(0, 2).map(t => ({
        id: t.id,
        name: t.name,
        code: t.code,
        price: t.price,
        sampleType: t.sampleType,
        fastingRequired: t.fastingRequired,
        type: 'test'
      })),
      isOffTopicBlocked: true
    };
  }

  // Match tests from catalog
  for (const t of testsCatalog) {
    if (
      lower.includes(t.name.toLowerCase()) || 
      (t.code && lower.includes(t.code.toLowerCase())) ||
      (t.category && lower.includes(t.category.toLowerCase())) ||
      (t.shortName && lower.includes(t.shortName.toLowerCase()))
    ) {
      if (!matchedTests.some(m => m.id === t.id)) {
        matchedTests.push({
          id: t.id,
          name: t.name,
          code: t.code,
          price: t.price,
          sampleType: t.sampleType,
          fastingRequired: t.fastingRequired,
          type: 'test'
        });
      }
    }
  }

  // Match packages from catalog
  for (const p of packagesCatalog) {
    if (
      lower.includes(p.name.toLowerCase()) ||
      (p.tagline && lower.includes(p.tagline.toLowerCase())) ||
      lower.includes('package') ||
      lower.includes('full body') ||
      lower.includes('checkup')
    ) {
      if (!matchedPackages.some(m => m.id === p.id)) {
        matchedPackages.push({
          id: p.id,
          name: p.name,
          price: p.price,
          type: 'package'
        });
      }
    }
  }

  // Find key knowledge matching
  let topic = "";
  if (lower.includes("cbc") || lower.includes("hemoglobin") || lower.includes("platelet") || lower.includes("wbc") || lower.includes("blood count") || lower.includes("anemia")) {
    topic = "cbc";
  } else if (lower.includes("lipid") || lower.includes("cholesterol") || lower.includes("triglyceride") || lower.includes("hdl") || lower.includes("ldl") || lower.includes("heart")) {
    topic = "lipid";
  } else if (lower.includes("sugar") || lower.includes("glucose") || lower.includes("diabetes") || lower.includes("hba1c")) {
    topic = "hba1c";
  } else if (lower.includes("thyroid") || lower.includes("tsh") || lower.includes("t3") || lower.includes("t4") || lower.includes("thyronorm")) {
    topic = "thyroid";
  } else if (lower.includes("lft") || lower.includes("liver") || lower.includes("sgpt") || lower.includes("sgot") || lower.includes("bilirubin") || lower.includes("jaundice")) {
    topic = "lft";
  } else if (lower.includes("kft") || lower.includes("kidney") || lower.includes("creatinine") || lower.includes("urea") || lower.includes("uric acid") || lower.includes("rft")) {
    topic = "kft";
  } else if (lower.includes("vitamin d") || lower.includes("vit d") || lower.includes("bone") || lower.includes("calcium")) {
    topic = "vitamin d";
  } else if (lower.includes("vitamin b12") || lower.includes("b12") || lower.includes("tingling") || lower.includes("nerve")) {
    topic = "vitamin b12";
  } else if (lower.includes("urine") || lower.includes("uti") || lower.includes("burning") || lower.includes("pus cells")) {
    topic = "urine";
  }

  if (topic && PATHOLOGY_KNOWLEDGE[topic]) {
    const info = PATHOLOGY_KNOWLEDGE[topic];
    let responseText = `**Clinical Test Overview: ${topic.toUpperCase()}**\n\n`;
    responseText += `${info.summary}\n\n`;
    responseText += `**📋 Pre-Test Preparation & Fasting:**\n${info.fasting}\n\n`;
    responseText += `**🧪 Sample Type & Turnaround Time (TAT):**\n• Sample: ${info.sample}\n• Reporting Time: ${info.tat}\n\n`;
    responseText += `**🔬 Key Clinical Indicators:**\n`;
    info.clinicalSignificance.forEach(sig => {
      responseText += `• ${sig}\n`;
    });
    responseText += `\n**📊 Reference Benchmark:** ${info.normalRange}\n\n`;
    responseText += `**💡 Microcells Patient Advisory:** ${info.precautions.join(", ")}. You can easily book this test for doorstep sample collection or walk into our lab!`;

    // Ensure relevant tests are attached
    if (matchedTests.length === 0 && testsCatalog.length > 0) {
      const fallback = testsCatalog.filter(t => t.name.toLowerCase().includes(topic) || t.code?.toLowerCase().includes(topic)).slice(0, 3);
      fallback.forEach(f => {
        matchedTests.push({
          id: f.id,
          name: f.name,
          code: f.code,
          price: f.price,
          sampleType: f.sampleType,
          fastingRequired: f.fastingRequired,
          type: 'test'
        });
      });
    }

    return {
      text: responseText,
      suggestedTests: [...matchedTests, ...matchedPackages].slice(0, 4)
    };
  }

  // General health or package query
  if (lower.includes("package") || lower.includes("full body") || lower.includes("preventive") || lower.includes("health checkup")) {
    let pkgText = `**Microcells Preventive Health Packages**\n\n`;
    pkgText += `Our comprehensive health packages are formulated by certified pathologists to evaluate major organ functions including Heart, Liver, Kidney, Thyroid, Blood indices, and essential Vitamins.\n\n`;
    pkgText += `**Preparation Guidance:**\n• Requires 10-12 hours overnight fasting\n• Water intake is encouraged to stay well hydrated for smooth phlebotomy\n• Reports are delivered online within 12-24 hours\n\n`;
    pkgText += `Would you like to book a doorstep sample collection for any of our curated checkup packages below?`;

    const suggested = packagesCatalog.slice(0, 3).map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      type: 'package'
    }));

    return {
      text: pkgText,
      suggestedTests: suggested
    };
  }

  // Generic pathology assistant response
  let genericText = `Hello! I am your **Microcells Diagnostic AI Health Assistant**.\n\n`;
  genericText += `I can provide immediate medical insights, pre-test preparation rules, fasting guidelines, sample types, and normal reference ranges for any diagnostic test in our pathology catalog, such as:\n\n`;
  genericText += `• **Complete Blood Count (CBC)** & Hemoglobin\n`;
  genericText += `• **Lipid Profile** (Cholesterol & Triglycerides)\n`;
  genericText += `• **Diabetes Screening** (HbA1c & Fasting Blood Sugar)\n`;
  genericText += `• **Thyroid Panel** (T3, T4, TSH)\n`;
  genericText += `• **Liver & Kidney Profiles** (LFT / KFT)\n`;
  genericText += `• **Vitamin D3 & B12** & Infectious Serologies (Dengue, Typhoid, etc.)\n\n`;
  genericText += `Feel free to ask questions like *"Do I need to fast for Lipid Profile?"*, *"What causes elevated SGPT?"*, or *"Which test is best for fatigue?"*`;

  const topTests = testsCatalog.slice(0, 3).map(t => ({
    id: t.id,
    name: t.name,
    code: t.code,
    price: t.price,
    sampleType: t.sampleType,
    fastingRequired: t.fastingRequired,
    type: 'test'
  }));

  return {
    text: genericText,
    suggestedTests: topTests
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // API Route: AI Service Health & Capabilities
  app.get("/api/ai/health", (req, res) => {
    const hasGemini = Boolean(process.env.GEMINI_API_KEY);
    const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);
    res.json({
      status: "ok",
      serverTime: new Date().toISOString(),
      providers: {
        gemini: { available: hasGemini, model: "gemini-3.7-flash" },
        openai: { available: hasOpenAI, model: "gpt-4o-mini" },
        localEngine: { available: true, model: "Microcells Pathology Expert Engine v2.0" }
      }
    });
  });

  // API Route: AI Diagnostic Chat Agent
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const {
        message,
        history = [],
        testsCatalog = [],
        packagesCatalog = [],
        websiteKnowledge = '',
        labInfo = {},
        provider = 'auto',
        customApiKey,
        persona = 'pathologist',
        additionalInstructions = '',
        strictWebsiteOnlyGuardrail = true,
        flagDoctorMedicineAdvice = true
      } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: "Missing or invalid prompt message" });
      }

      const contactDesk = {
        phone: labInfo?.phone || "+91 98765 43210",
        whatsapp: labInfo?.whatsappNumber || "+919876543210",
        email: labInfo?.email || "contact@microcellsdiagnostics.com",
        emergency: labInfo?.emergencyContact || "+91 98765 43211"
      };

      // 1. Pre-Processing Guardrail: Medicine / Prescription / Doctor Treatment Request
      const medCheck = checkMedicineOrDoctorAdvice(message);
      if (flagDoctorMedicineAdvice && medCheck.isAdvised) {
        const localMedResponse = generateLocalPathologyResponse(message, testsCatalog, packagesCatalog, labInfo);
        return res.json({
          reply: localMedResponse.text,
          suggestedTests: localMedResponse.suggestedTests,
          isMedicalOrDrugAdvised: true,
          showContactCard: true,
          contactDeskInfo: contactDesk,
          source: "pathology_engine",
          model: "Microcells Guardrail & Clinical Interceptor"
        });
      }

      // 2. Pre-Processing Guardrail: Off-Topic / Out of Website Scope Request
      if (strictWebsiteOnlyGuardrail && checkOffTopicQuery(message)) {
        const localOffTopic = generateLocalPathologyResponse(message, testsCatalog, packagesCatalog, labInfo);
        return res.json({
          reply: localOffTopic.text,
          suggestedTests: localOffTopic.suggestedTests,
          isOffTopicBlocked: true,
          source: "pathology_engine",
          model: "Microcells Domain Sandbox Guardrail"
        });
      }

      // Format catalog context for prompt injection
      const testsSummary = testsCatalog.slice(0, 40).map((t: any) => 
        `- ${t.name} (Code: ${t.code || 'N/A'}, Price: ₹${t.price}, Category: ${t.category || 'Pathology'}, Sample: ${t.sampleType || 'Blood'}, Fasting: ${t.fastingRequired ? `Yes (${t.fastingHours || 10}-12 hrs)` : 'No Fasting'}, TAT: ${t.turnaroundTime || 'Same Day'})`
      ).join('\n');

      const packagesSummary = packagesCatalog.slice(0, 15).map((p: any) => 
        `- ${p.name} (Price: ₹${p.price}, Parameters: ${p.parametersCount || p.totalTests || 'Multiple'}, Ideal For: ${p.idealFor || 'All Adults'}, Fasting: ${p.fastingInfo || '10-12 hrs fasting'})`
      ).join('\n');

      const personaStyle = persona === 'pathologist' 
        ? "You are the Senior Clinical Pathologist at Microcells Diagnostics Pvt. Ltd. You explain medical tests clearly, scientifically, accurately, and empathetically."
        : persona === 'counselor'
          ? "You are a warm, supportive Patient Health Counselor at Microcells Diagnostics. You make lab tests friendly and easy to understand."
          : "You are the Concierge Diagnostic Assistant at Microcells Diagnostics, helping patients understand test requirements, preparation, and booking.";

      const systemInstruction = `${personaStyle}

You exclusively represent Microcells Diagnostics Pvt. Ltd. (NABL & ISO 15189:2022 Accredited Pathology Laboratory).
Official Lab Helpline: ${contactDesk.phone} | WhatsApp: ${contactDesk.whatsapp} | Email: ${contactDesk.email}

=== STRICT OPERATING GUARDRAILS & CLINICAL BOUNDARIES ===
1. STRICT WEBSITE & LAB CONTEXT BOUNDARY (SLM ECOSYSTEM):
   - You MUST ONLY discuss information, tests, packages, timings, sample rules, and procedures related to Microcells Diagnostics.
   - Do NOT quote data, prices, or numbers outside this laboratory's verified catalog.
   - NEVER output any external telephone numbers or non-Microcells URLs. Always refer inquiries to the official Microcells Helpline (${contactDesk.phone}) or WhatsApp (${contactDesk.whatsapp}).
   - If asked about non-laboratory topics (coding, sports, world news, cooking, etc.), politely decline by stating your role is strictly limited to Microcells Diagnostics pathology services.

2. STRICT MEDICAL ADVICE & PRESCRIPTION PROHIBITION:
   - You are a diagnostic pathology assistant. You MUST NEVER prescribe specific medicines, drug dosages, antibiotic courses, or medical treatments.
   - If a patient asks what medicine to take for a condition, explain what diagnostic screening tests evaluate those clinical parameters (e.g. CBC, CRP, Blood Sugar, Lipid, Thyroid, LFT, KFT) and strongly advise consulting a registered physician / treating doctor.

3. ACCURACY ON PATHOLOGY TESTS & SAMPLES:
   - Always state the required sample type (EDTA Purple Top, SST Yellow Top, Fluoride Gray Top, Urine Container).
   - Always state the exact fasting requirement (e.g., 10-12 hours overnight fasting for Fasting Blood Sugar or Lipid Profile; No fasting for CBC/HbA1c/Thyroid/Urine).
   - Mention turnaround times and emphasize that Microcells provides certified doorstep sample collection with cold-chain logistics.

MICROCELLS DIAGNOSTICS LABORATORY CATALOG CONTEXT:
[Available Tests]
${testsSummary}

[Available Health Packages]
${packagesSummary}

${websiteKnowledge ? `\n[ADDITIONAL WEBSITE GROUND TRUTH]\n${websiteKnowledge.slice(0, 3000)}` : ''}
${additionalInstructions ? `\n[LAB MANAGER INSTRUCTIONS]\n${additionalInstructions}` : ''}`;

      // 1. If OpenAI / ChatGPT was explicitly requested or custom OpenAI key provided:
      const openAiKey = (provider === 'chatgpt' && customApiKey) ? customApiKey : process.env.OPENAI_API_KEY;
      if ((provider === 'chatgpt' || (!process.env.GEMINI_API_KEY && openAiKey)) && openAiKey) {
        try {
          const formattedMessages = [
            { role: "system", content: systemInstruction },
            ...history.slice(-6).map((h: any) => ({
              role: h.role === 'assistant' ? 'assistant' : 'user',
              content: h.content
            })),
            { role: "user", content: message }
          ];

          const openAiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${openAiKey}`
            },
            body: JSON.stringify({
              model: "gpt-4o-mini",
              messages: formattedMessages,
              temperature: 0.5,
              max_tokens: 1200
            })
          });

          if (openAiResponse.ok) {
            const data = await openAiResponse.json();
            const replyText = data.choices?.[0]?.message?.content || "";
            
            // Extract matched test suggestions from catalog
            const localMatches = generateLocalPathologyResponse(message, testsCatalog, packagesCatalog, labInfo);
            
            return res.json({
              reply: replyText,
              suggestedTests: localMatches.suggestedTests,
              source: "openai",
              model: "gpt-4o-mini"
            });
          }
        } catch (openAiErr) {
          console.warn("OpenAI API call failed, falling back to Gemini/Local engine:", openAiErr);
        }
      }

      // 2. Try Gemini API via @google/genai SDK (recommended server-side AI)
      const geminiClient = getGeminiClient(provider === 'gemini' ? customApiKey : undefined);
      if (geminiClient) {
        try {
          // Construct conversation history for Gemini
          let fullPrompt = `${systemInstruction}\n\n`;
          if (history.length > 0) {
            fullPrompt += "RECENT CONVERSATION HISTORY:\n";
            history.slice(-4).forEach((h: any) => {
              fullPrompt += `${h.role === 'assistant' ? 'AI Pathologist' : 'Patient'}: ${h.content}\n`;
            });
            fullPrompt += "\n";
          }
          fullPrompt += `Patient Query: ${message}`;

          const geminiResult = await generateGeminiContentWithFallback(
            geminiClient,
            fullPrompt,
            { temperature: 0.5 }
          );

          if (geminiResult && geminiResult.text) {
            const replyText = geminiResult.text;
            // Match relevant test objects from catalog for quick booking chips
            const localMatches = generateLocalPathologyResponse(message, testsCatalog, packagesCatalog, labInfo);

            return res.json({
              reply: replyText,
              suggestedTests: localMatches.suggestedTests,
              source: "gemini",
              model: geminiResult.model
            });
          }
        } catch (geminiErr: any) {
          console.log("Gemini engine fallback to local knowledge base:", geminiErr?.message || "overload");
        }
      }

      // 3. Robust Local Pathology Intelligence Engine fallback
      const localResult = generateLocalPathologyResponse(message, testsCatalog, packagesCatalog, labInfo);
      return res.json({
        reply: localResult.text,
        suggestedTests: localResult.suggestedTests,
        source: "pathology_engine",
        model: "Microcells Clinical Knowledge Engine"
      });

    } catch (err: any) {
      console.error("Error in /api/ai/chat:", err);
      const fallback = generateLocalPathologyResponse(req.body?.message || "", req.body?.testsCatalog || [], req.body?.packagesCatalog || [], req.body?.labInfo || {});
      return res.json({
        reply: fallback.text,
        suggestedTests: fallback.suggestedTests,
        source: "pathology_engine",
        fallback: true
      });
    }
  });

  // API Route: Specific Test AI Details Fetcher
  app.post("/api/ai/test-details", async (req, res) => {
    try {
      const { testName, testCode, category } = req.body;
      if (!testName) {
        return res.status(400).json({ error: "testName is required" });
      }

      const geminiClient = getGeminiClient();
      if (geminiClient) {
        try {
          const prompt = `As a Senior Clinical Pathologist at Microcells Diagnostics, provide a structured clinical profile for the diagnostic test: "${testName}" (Category: ${category || 'Pathology'}, Code: ${testCode || 'N/A'}).

Provide the response in the following structured format:
- **Clinical Purpose**: (Why this test is done and what conditions it screens for in 2-3 sentences)
- **Sample Requirements**: (Exact tube/specimen type, e.g. EDTA Whole blood, SST Serum, Fluoride Plasma, Sterile Urine)
- **Fasting & Preparation**: (Exact fasting hours, medication or diet instructions)
- **Key Parameters Analyzed**: (List 3-5 main biomarkers)
- **Turnaround Time (TAT)**: (Standard reporting duration)
- **Clinical Interpretation**: (What high or low values generally indicate)`;

          const response = await generateGeminiContentWithFallback(geminiClient, prompt);

          if (response && response.text) {
            return res.json({
              details: response.text,
              source: "gemini",
              model: response.model
            });
          }
        } catch (e: any) {
          console.log("Test details fallback to local knowledge:", e?.message || "overload");
        }
      }

      // Local fallback
      const key = testName.toLowerCase();
      let found = Object.keys(PATHOLOGY_KNOWLEDGE).find(k => key.includes(k));
      if (found && PATHOLOGY_KNOWLEDGE[found]) {
        const info = PATHOLOGY_KNOWLEDGE[found];
        const text = `**Clinical Purpose**\n${info.summary}\n\n**Sample Requirements**\n${info.sample}\n\n**Fasting & Preparation**\n${info.fasting}\n\n**Key Parameters Analyzed**\n${info.clinicalSignificance.map(c => `• ${c}`).join('\n')}\n\n**Turnaround Time**\n${info.tat}\n\n**Reference Benchmark**\n${info.normalRange}`;
        return res.json({ details: text, source: "pathology_engine" });
      }

      return res.json({
        details: `**Clinical Purpose**\n${testName} is a high-precision diagnostic examination evaluated using automated clinical analyzers at Microcells Diagnostics.\n\n**Sample Requirements**\nSterile venous blood or specimen collected by certified phlebotomist.\n\n**Fasting & Preparation**\n8-10 hours fasting recommended unless specified as non-fasting by your physician.\n\n**Turnaround Time**\nSame Day reporting (4 to 8 hours).`,
        source: "pathology_engine"
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Diagnostic Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
