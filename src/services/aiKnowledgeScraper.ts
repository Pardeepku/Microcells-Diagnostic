import { 
  LabInfo, 
  SiteContentConfig, 
  TestItem, 
  HealthPackage, 
  FAQItem, 
  BlogPost, 
  CustomPageItem 
} from '../types';

export interface MicrocellsSLMKnowledge {
  summaryPrompt: string;
  totalEntities: {
    tests: number;
    packages: number;
    faqs: number;
    blogs: number;
    branches: number;
  };
  contactInfo: {
    companyName: string;
    phone: string;
    altPhone: string;
    whatsapp: string;
    emergency: string;
    email: string;
    address: string;
    timings: string;
    homeCollectionTimings: string;
  };
}

// Regex patterns for detecting doctor medical advice / medication / drug dosage / prescription requests
const MEDICINE_PRESCRIPTION_PATTERNS = [
  /\b(prescribe|prescription|medicine|medicines|medication|medications|tablet|tablets|capsule|capsules|syrup|injection|dosage|dose|mg|ml|cure|treatment for|cure for|remedy for|treat my|what should i take|which medicine|which drug|recommend a drug|antibiotic|antibiotics|painkiller|pain killer|paracetamol|crocin|dolo|azithromycin|amoxicillin|metformin|insulin dose|pantoprazole|atorvastatin|thyronorm dose|telmisartan|cough syrup)\b/i,
  /\b(how many (mg|pills|tablets)|can i take|should i take|is it safe to take|give me medicine|doctor advise|doctor advice|treat me|diagnose me)\b/i,
  /\b(how to cure|how to treat|home remedy for infection|what to drink for fever|medicine for fever|medicine for cold|medicine for diabetes|medicine for thyroid|medicine for cholesterol)\b/i
];

// Patterns indicating off-topic queries outside the pathology laboratory scope
const OFF_TOPIC_PATTERNS = [
  /\b(write code|python|javascript|react|html|css|sql|programming|debug|algorithm)\b/i,
  /\b(president of|capital of|who is prime minister|who won|world cup|cricket score|movie review|netflix|song lyrics|poem|joke|story about|astrology|horoscope|crypto|bitcoin|ethereum|stock market|share price)\b/i,
  /\b(recipe for|how to cook|bake a cake|restaurant in|flight to|hotel in|weather in|car repair|plumbing)\b/i,
  /\b(competitor|lal path|thyrocare|dr lal|metropolis|apollo clinic|srl diagnostics|suburban diagnostics)\b/i
];

/**
 * Checks if a user's prompt is requesting specific medical advice, drug prescriptions, or dosages
 */
export function detectDoctorOrMedicineAdvice(message: string): {
  isAdvised: boolean;
  detectedKeywords: string[];
} {
  const matched: string[] = [];
  const lower = message.toLowerCase();

  for (const pattern of MEDICINE_PRESCRIPTION_PATTERNS) {
    const match = lower.match(pattern);
    if (match) {
      matched.push(match[0]);
    }
  }

  return {
    isAdvised: matched.length > 0,
    detectedKeywords: Array.from(new Set(matched))
  };
}

/**
 * Checks if a user's prompt is completely outside the laboratory and diagnostic scope
 */
export function detectOffTopicQuery(message: string): {
  isOffTopic: boolean;
  reason?: string;
} {
  const lower = message.toLowerCase();

  for (const pattern of OFF_TOPIC_PATTERNS) {
    if (pattern.test(lower)) {
      return {
        isOffTopic: true,
        reason: "Query pertains to general world topics, coding, entertainment, or outside entities."
      };
    }
  }

  // If query is too generic and has zero diagnostic/health/appointment terms
  const diagnosticKeywords = [
    'test', 'package', 'blood', 'urine', 'stool', 'fasting', 'report', 'lab', 'microcells', 
    'sample', 'home collection', 'health', 'cbc', 'lipid', 'liver', 'kidney', 'thyroid', 
    'sugar', 'glucose', 'hba1c', 'vitamin', 'doctor', 'appointment', 'cost', 'price', 
    'address', 'timing', 'phone', 'contact', 'result', 'platelet', 'fever', 'cough', 
    'pain', 'swelling', 'checkup', 'booking', 'phlebotomy', 'branch', 'location'
  ];

  const hasDiagnosticTerm = diagnosticKeywords.some(k => lower.includes(k));
  if (message.split(' ').length > 4 && !hasDiagnosticTerm) {
    // If it looks like a long question with no medical/lab keywords
    if (/^(what is the capital|how do i build|tell me a story|who was|explain quantum|write a|translate)/i.test(lower)) {
      return {
        isOffTopic: true,
        reason: "Non-diagnostic inquiry."
      };
    }
  }

  return { isOffTopic: false };
}

/**
 * Scrapes and aggregates all website data into a rich, token-efficient SLM knowledge context
 */
export function buildMicrocellsSLMKnowledgeContext(
  labInfo: LabInfo,
  siteContent: SiteContentConfig,
  tests: TestItem[],
  packages: HealthPackage[],
  faqs: FAQItem[],
  blogPosts: BlogPost[],
  customPages: CustomPageItem[] = []
): MicrocellsSLMKnowledge {
  const contactInfo = {
    companyName: labInfo.companyName || "Microcells Diagnostics Pvt. Ltd.",
    phone: labInfo.phone || "+91 98765 43210",
    altPhone: labInfo.altPhone || "+91 11 2345 6789",
    whatsapp: labInfo.whatsappNumber || "+919876543210",
    emergency: labInfo.emergencyContact || "+91 98765 43211",
    email: labInfo.email || "contact@microcellsdiagnostics.com",
    address: labInfo.address || "Plot 104, Medical Hub & Diagnostic Centre, Healthcare Avenue, Phase-1, City - 400001",
    timings: labInfo.timings || "Mon - Sat: 7:00 AM – 9:00 PM | Sunday: 7:00 AM – 2:00 PM",
    homeCollectionTimings: labInfo.homeCollectionTimings || "6:30 AM – 7:30 PM (Daily)"
  };

  // 1. Format Laboratory & Branches Knowledge
  const branchesText = (labInfo.branches || []).map(b => 
    `• ${b.name}${b.isHQ ? ' (Central HQ)' : ''}: ${b.address} | Phone: ${b.phone} | Timings: ${b.hours}`
  ).join('\n');

  // 2. Format Pathology Tests Catalog (Indexed with strict prices, fasting & sample types)
  const testsIndexed = tests.map(t => 
    `• ${t.name} (Code: ${t.code}) | Price: ₹${t.price} | Category: ${t.category} | Sample: ${t.sampleType} | Fasting: ${t.fastingRequired ? `Yes (${t.fastingHours || 10}-12 hrs)` : 'No Fasting'} | TAT: ${t.turnaroundTime} | Uses: ${t.commonUses || t.description}`
  ).join('\n');

  // 3. Format Health Packages
  const packagesIndexed = packages.map(p => 
    `• ${p.name} | Price: ₹${p.price} (Original: ₹${p.originalPrice}, Save ${p.discountPercentage}%) | Tests Count: ${p.parametersCount} Parameters | Ideal For: ${p.idealFor} | Fasting: ${p.fastingInfo}`
  ).join('\n');

  // 4. Format Frequently Asked Questions (FAQs)
  const faqsIndexed = faqs.map(f => 
    `Q: ${f.question}\nA: ${f.answer}`
  ).join('\n\n');

  // 5. Format Blog / Clinical Insights
  const blogIndexed = blogPosts.map(b => 
    `• Article: "${b.title}" (${b.category}) - Key Takeaways: ${b.keyTakeaways.join('; ')}`
  ).join('\n');

  // 6. Build the Complete Unified SLM Domain Knowledge Prompt
  const summaryPrompt = `
=== MICROCELLS DIAGNOSTICS LAB - DOMAIN SLM KNOWLEDGE ECOSYSTEM ===
[LAB PROFILE & ACCREDITATIONS]
- Official Name: ${contactInfo.companyName}
- Tagline: ${labInfo.tagline || 'Accurate Diagnostics. Better Healthcare.'}
- Accreditations: ${labInfo.nablAccreditationText || 'NABL Accredited Reference Laboratory (MC-2024-8841)'} | ${labInfo.isoAccreditationText || 'ISO 15189:2022 Certified'} | ICMR: ${labInfo.icmrRegNumber || 'ICMR-REG-IND-9941'}
- Operating Hours: ${contactInfo.timings}
- Home Collection Hours: ${contactInfo.homeCollectionTimings}
- Main Helpdesk: ${contactInfo.phone} | Alternate: ${contactInfo.altPhone}
- WhatsApp Desk: ${contactInfo.whatsapp}
- Emergency Helpline: ${contactInfo.emergency}
- Email: ${contactInfo.email}
- Main Laboratory Address: ${contactInfo.address} (Landmark: ${labInfo.landmark || 'Near Central Metro Station, Gate No. 2'})

[BRANCHES & COLLECTION CENTERS]
${branchesText}

[HOME SAMPLE COLLECTION PROTOCOL]
- Doorstep phlebotomy conducted by trained, certified phlebotomists.
- 100% single-use, sterile barcoded vacuum tubes (vacutainers).
- Temperature-controlled cold chain logistics for immediate specimen stability.
- Digital reports delivered via WhatsApp, SMS, Email, and online portal within standard TAT.

[COMPLETE PATHOLOGY TESTS CATALOG - GROUND TRUTH]
${testsIndexed}

[PREVENTIVE HEALTH CHECKUP PACKAGES - GROUND TRUTH]
${packagesIndexed}

[PATIENT FREQUENTLY ASKED QUESTIONS & GUIDELINES]
${faqsIndexed}

[CLINICAL INSIGHTS & BLOG KNOWLEDGE]
${blogIndexed}
==================================================================
`;

  return {
    summaryPrompt,
    totalEntities: {
      tests: tests.length,
      packages: packages.length,
      faqs: faqs.length,
      blogs: blogPosts.length,
      branches: (labInfo.branches || []).length
    },
    contactInfo
  };
}
