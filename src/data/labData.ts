import { 
  TestItem, 
  HealthPackage, 
  DiagnosticDepartment, 
  BlogPost, 
  FAQItem, 
  PatientReportRecord 
} from '../types';

export const LAB_INFO = {
  companyName: "Microcells Diagnostics Pvt. Ltd.",
  tradeName: "Micro Cells Diagnostics",
  tagline: "Accurate Diagnostics. Better Healthcare.",
  subTagline: "Advanced pathology testing with reliable results, modern technology, and patient-focused care.",
  phone: "+91 98765 43210",
  altPhone: "+91 11 2345 6789",
  whatsappNumber: "+919876543210",
  whatsappDisplay: "+91 98765 43210",
  email: "contact@microcellsdiagnostics.com",
  supportEmail: "reports@microcellsdiagnostics.com",
  address: "Plot 104, Medical Hub & Diagnostic Centre, Healthcare Avenue, Phase-1, City - 400001",
  landmark: "Near Central Metro Station, Gate No. 2",
  timings: "Mon - Sat: 7:00 AM – 9:00 PM | Sunday: 7:00 AM – 2:00 PM",
  homeCollectionTimings: "6:30 AM – 7:30 PM (Daily)",
  emergencyContact: "+91 98765 43211",
  branches: [
    {
      name: "Central Reference Laboratory",
      address: "Plot 104, Healthcare Avenue, Phase-1, City - 400001",
      phone: "+91 98765 43210",
      hours: "7:00 AM - 9:00 PM",
      isHQ: true
    },
    {
      name: "North City Collection Centre",
      address: "Shop 12, Sunrise Medical Complex, North Boulevard, City - 400018",
      phone: "+91 98765 43212",
      hours: "7:30 AM - 8:00 PM",
      isHQ: false
    },
    {
      name: "Westside Diagnostic Point",
      address: "Unit 3B, Wellness Arcade, West Ring Road, City - 400045",
      phone: "+91 98765 43213",
      hours: "7:00 AM - 7:30 PM",
      isHQ: false
    }
  ]
};

export const POPULAR_TESTS: TestItem[] = [
  {
    id: 'cbc-01',
    name: 'Complete Blood Count (CBC) with ESR',
    code: 'HEM-101',
    category: 'Hematology',
    sampleType: 'Blood',
    fastingRequired: false,
    turnaroundTime: '4 - 6 Hours',
    price: 350,
    originalPrice: 500,
    description: 'Comprehensive analysis of red blood cells, white blood cells, platelets, and erythrocyte sedimentation rate to evaluate overall health and detect infections or anemia.',
    parametersCount: 24,
    parametersList: [
      'Hemoglobin (Hb)', 'Total Leukocyte Count (TLC)', 'RBC Count', 'Platelet Count', 
      'Packed Cell Volume (PCV)', 'MCV', 'MCH', 'MCHC', 'RDW-CV', 'RDW-SD', 
      'Neutrophils', 'Lymphocytes', 'Monocytes', 'Eosinophils', 'Basophils', 
      'Absolute Neutrophil Count', 'Absolute Lymphocyte Count', 'ESR (Westergren)'
    ],
    commonUses: 'Screening for anemia, infections, bleeding disorders, and general physiological wellness.',
    preparationNotes: 'No special fasting required. Stay normally hydrated prior to sample collection.',
    isPopular: true,
    healthConcern: 'General Wellness'
  },
  {
    id: 'hba1c-02',
    name: 'HbA1c (Glycated Hemoglobin)',
    code: 'BIO-201',
    category: 'Biochemistry',
    sampleType: 'Blood',
    fastingRequired: false,
    turnaroundTime: 'Same Day (4 Hours)',
    price: 450,
    originalPrice: 650,
    description: 'Evaluates your average blood sugar levels over the past 2 to 3 months. Gold-standard test for diagnosing and monitoring diabetes management.',
    parametersCount: 3,
    parametersList: ['HbA1c Concentration', 'Estimated Average Glucose (eAG)', 'HbA1c % of Total Hb'],
    commonUses: 'Diabetes diagnosis, ongoing diabetic glucose control tracking, prediabetes screening.',
    preparationNotes: 'Can be done at any time of day; fasting is not mandatory.',
    isPopular: true,
    healthConcern: 'Diabetes'
  },
  {
    id: 'lipid-03',
    name: 'Lipid Profile (Cholesterol Panel)',
    code: 'BIO-205',
    category: 'Biochemistry',
    sampleType: 'Blood',
    fastingRequired: true,
    fastingHours: 10,
    turnaroundTime: 'Same Day (6 Hours)',
    price: 600,
    originalPrice: 850,
    description: 'Measures circulating blood fats including good (HDL), bad (LDL/VLDL) cholesterol and triglycerides to assess cardiovascular disease risk.',
    parametersCount: 8,
    parametersList: [
      'Total Cholesterol', 'HDL Cholesterol', 'LDL Cholesterol (Calculated)', 
      'VLDL Cholesterol', 'Triglycerides', 'Total Cholesterol / HDL Ratio', 
      'LDL / HDL Ratio', 'Non-HDL Cholesterol'
    ],
    commonUses: 'Cardiovascular risk evaluation, coronary artery disease assessment, monitoring statin therapy.',
    preparationNotes: 'Strict 10–12 hours overnight fasting required. Water is permitted.',
    isPopular: true,
    healthConcern: 'Heart'
  },
  {
    id: 'lft-04',
    name: 'Liver Function Test (LFT)',
    code: 'BIO-210',
    category: 'Biochemistry',
    sampleType: 'Blood',
    fastingRequired: true,
    fastingHours: 8,
    turnaroundTime: 'Same Day (6 Hours)',
    price: 700,
    originalPrice: 950,
    description: 'Comprehensive panel measuring enzymes, bilirubin, and proteins produced or processed by the liver to detect hepatic injury, inflammation, or dysfunction.',
    parametersCount: 11,
    parametersList: [
      'Bilirubin Total', 'Bilirubin Direct (Conjugated)', 'Bilirubin Indirect', 
      'SGOT / AST', 'SGPT / ALT', 'Alkaline Phosphatase (ALP)', 
      'Total Protein', 'Serum Albumin', 'Serum Globulin', 'A/G Ratio', 'GGTP'
    ],
    commonUses: 'Evaluating liver health, screening for jaundice, monitoring medication toxicity, checking for fatty liver.',
    preparationNotes: '8 to 10 hours overnight fasting recommended before sample collection.',
    isPopular: true,
    healthConcern: 'Liver'
  },
  {
    id: 'kft-05',
    name: 'Kidney Function Test (KFT / RFT)',
    code: 'BIO-215',
    category: 'Biochemistry',
    sampleType: 'Blood',
    fastingRequired: true,
    fastingHours: 8,
    turnaroundTime: 'Same Day (6 Hours)',
    price: 650,
    originalPrice: 900,
    description: 'Assesses renal filtration capacity and electrolyte equilibrium by checking blood urea, creatinine, uric acid, and key minerals.',
    parametersCount: 9,
    parametersList: [
      'Blood Urea Nitrogen (BUN)', 'Serum Urea', 'Serum Creatinine', 
      'eGFR (Estimated GFR)', 'Serum Uric Acid', 'Serum Calcium', 
      'Sodium (Na+)', 'Potassium (K+)', 'Chloride (Cl-)'
    ],
    commonUses: 'Detecting renal impairment, monitoring hypertensive and diabetic renal load, assessing dehydration.',
    preparationNotes: '8 hours fasting recommended. Avoid strenuous heavy workout immediately prior.',
    isPopular: true,
    healthConcern: 'Kidney'
  },
  {
    id: 'thyroid-06',
    name: 'Thyroid Profile Total (T3, T4, TSH)',
    code: 'BIO-220',
    category: 'Biochemistry',
    sampleType: 'Blood',
    fastingRequired: true,
    fastingHours: 8,
    turnaroundTime: 'Same Day (6 Hours)',
    price: 550,
    originalPrice: 800,
    description: 'Measures primary thyroid hormones to check for hypothyroidism (underactive thyroid) or hyperthyroidism (overactive thyroid).',
    parametersCount: 3,
    parametersList: ['Total Triiodothyronine (T3)', 'Total Thyroxine (T4)', 'Thyroid Stimulating Hormone (TSH Ultrasensitive)'],
    commonUses: 'Weight fluctuation investigations, fatigue, menstrual irregularities, metabolic evaluation.',
    preparationNotes: 'Morning sample preferred. If on thyroid medication, collect sample before daily dose.',
    isPopular: true,
    healthConcern: 'Thyroid'
  },
  {
    id: 'vitd-07',
    name: 'Vitamin D 25-Hydroxy (Total)',
    code: 'IMM-301',
    category: 'Immunology & Serology',
    sampleType: 'Blood',
    fastingRequired: false,
    turnaroundTime: 'Same Day (8 Hours)',
    price: 1100,
    originalPrice: 1600,
    description: 'Quantifies 25-hydroxyvitamin D levels in serum to evaluate bone density risk, immune health, and deficiency status.',
    parametersCount: 2,
    parametersList: ['25-OH Vitamin D Total', 'Deficiency / Sufficiency Index Range'],
    commonUses: 'Bone pain, joint weakness, chronic fatigue, osteoporosis screening, immune health.',
    preparationNotes: 'Fasting is not required.',
    isPopular: true,
    healthConcern: 'Vitamins'
  },
  {
    id: 'vitb12-08',
    name: 'Vitamin B12 (Cyanocobalamin)',
    code: 'IMM-305',
    category: 'Immunology & Serology',
    sampleType: 'Blood',
    fastingRequired: true,
    fastingHours: 8,
    turnaroundTime: 'Same Day (8 Hours)',
    price: 850,
    originalPrice: 1200,
    description: 'Evaluates neurological and hematological vitamin status. Critical for nerve transmission and healthy red blood cell production.',
    parametersCount: 1,
    parametersList: ['Serum Vitamin B12 Concentration'],
    commonUses: 'Neuropathy, tingling/numbness in extremities, vegetarian/vegan dietary checks, megaloblastic anemia.',
    preparationNotes: 'Overnight 8-hour fasting recommended for optimal baseline accuracy.',
    isPopular: true,
    healthConcern: 'Vitamins'
  },
  {
    id: 'fbs-09',
    name: 'Fasting Blood Sugar (Glucose Fasting)',
    code: 'BIO-202',
    category: 'Biochemistry',
    sampleType: 'Blood',
    fastingRequired: true,
    fastingHours: 8,
    turnaroundTime: '2 - 3 Hours',
    price: 120,
    originalPrice: 180,
    description: 'Measures blood glucose levels after a period of overnight fasting to detect impaired fasting glucose or diabetes mellitus.',
    parametersCount: 1,
    parametersList: ['Fasting Plasma Glucose'],
    commonUses: 'Routine diabetic checkup, pre-employment screening, metabolic baseline.',
    preparationNotes: '8 to 10 hours overnight fasting. Water is permitted.',
    isPopular: true,
    healthConcern: 'Diabetes'
  },
  {
    id: 'urine-10',
    name: 'Urine Routine & Microscopic Examination',
    code: 'PAT-401',
    category: 'Clinical Pathology',
    sampleType: 'Urine',
    fastingRequired: false,
    turnaroundTime: '3 - 4 Hours',
    price: 200,
    originalPrice: 300,
    description: 'Physical, chemical, and microscopic examination of urine to detect urinary tract infections, renal stones, proteinuria, and metabolic waste indicators.',
    parametersCount: 18,
    parametersList: [
      'Color & Appearance', 'Specific Gravity', 'pH', 'Protein / Albumin', 
      'Glucose / Sugar', 'Ketones', 'Bile Salts & Pigments', 'Urobilinogen', 
      'Pus Cells (WBC)', 'RBCs', 'Epithelial Cells', 'Casts', 'Crystals', 'Bacteria / Yeast'
    ],
    commonUses: 'Urinary tract infection (UTI), kidney health, diabetes screening, pre-surgical assessment.',
    preparationNotes: 'Collect clean catch mid-stream early morning first void urine sample in sterile container.',
    isPopular: true,
    healthConcern: 'Kidney'
  },
  {
    id: 'dengue-11',
    name: 'Dengue Serology Panel (NS1 + IgM + IgG)',
    code: 'IMM-310',
    category: 'Immunology & Serology',
    sampleType: 'Blood',
    fastingRequired: false,
    turnaroundTime: 'Same Day (4 Hours)',
    price: 950,
    originalPrice: 1400,
    description: 'Detects early Dengue NS1 viral antigen as well as IgM/IgG antibodies to confirm acute or secondary dengue viral infection.',
    parametersCount: 3,
    parametersList: ['Dengue NS1 Antigen', 'Dengue IgM Antibodies', 'Dengue IgG Antibodies'],
    commonUses: 'Acute febrile illness, sudden high fever with body ache, suspected mosquito-borne viral infection.',
    preparationNotes: 'No fasting required. Immediate testing advised upon onset of fever symptoms.',
    isPopular: false,
    healthConcern: 'Fever'
  },
  {
    id: 'ferritin-12',
    name: 'Serum Ferritin (Iron Storage Profile)',
    code: 'IMM-315',
    category: 'Immunology & Serology',
    sampleType: 'Blood',
    fastingRequired: true,
    fastingHours: 8,
    turnaroundTime: 'Same Day (6 Hours)',
    price: 750,
    originalPrice: 1000,
    description: 'Measures the major iron storage protein in blood to diagnose iron deficiency anemia or conditions causing iron overload.',
    parametersCount: 1,
    parametersList: ['Serum Ferritin Level'],
    commonUses: 'Investigation of chronic fatigue, hair loss, microcytic anemia, and inflammatory activity.',
    preparationNotes: '8 hours fasting recommended; avoid taking iron supplements 24h prior unless advised.',
    isPopular: false,
    healthConcern: 'General Wellness'
  },
  {
    id: 'stool-13',
    name: 'Stool Routine & Occult Blood Examination',
    code: 'PAT-405',
    category: 'Clinical Pathology',
    sampleType: 'Stool',
    fastingRequired: false,
    turnaroundTime: 'Same Day (6 Hours)',
    price: 300,
    originalPrice: 450,
    description: 'Macroscopic and microscopic analysis of stool to diagnose intestinal parasites, occult gastrointestinal bleeding, and digestive malabsorption.',
    parametersCount: 12,
    parametersList: ['Consistency & Color', 'Mucus & Blood Presence', 'Occult Blood (FOBT)', 'Ova & Parasites', 'Pus Cells', 'RBCs', 'Cysts & Trophozoites', 'Reducing Substances'],
    commonUses: 'Chronic diarrhea, gastrointestinal pain, unexplained anemia, suspected GI bleeding.',
    preparationNotes: 'Collect in clean dry container. Avoid contamination with urine or toilet water.',
    isPopular: false,
    healthConcern: 'Infection'
  },
  {
    id: 'culture-14',
    name: 'Urine Culture and Antibiotic Sensitivity',
    code: 'MIC-501',
    category: 'Microbiology',
    sampleType: 'Urine',
    fastingRequired: false,
    turnaroundTime: '48 - 72 Hours',
    price: 800,
    originalPrice: 1100,
    description: 'Identifies causative bacterial or fungal pathogens in urine and tests susceptibility against a comprehensive panel of targeted antibiotics.',
    parametersCount: 6,
    parametersList: ['Organism Isolation', 'Colony Count (CFU/mL)', 'Gram Stain Characteristics', 'Antibiotic Susceptibility Panel', 'Resistance Markers'],
    commonUses: 'Recurrent UTI, fever of unknown origin, treatment failure, pre-urological procedures.',
    preparationNotes: 'First morning mid-stream clean-catch urine. Collect before starting antibiotic course.',
    isPopular: false,
    healthConcern: 'Infection'
  },
  {
    id: 'pap-15',
    name: 'Liquid Based Cytology / Pap Smear',
    code: 'CYT-601',
    category: 'Histopathology & Cytology',
    sampleType: 'Swab',
    fastingRequired: false,
    turnaroundTime: '48 Hours',
    price: 900,
    originalPrice: 1300,
    description: 'Cytological screening examination for early detection of cervical cellular dysplasia, precancerous changes, and localized infections.',
    parametersCount: 4,
    parametersList: ['Specimen Adequacy', 'General Categorization', 'Cytological Interpretation', 'Infection / Organisms Detected'],
    commonUses: 'Routine cervical health screening, abnormal spotting investigation, women preventive wellness.',
    preparationNotes: 'Avoid douching, vaginal medications or intercourse 48h prior. Schedule after menstrual cycle.',
    isPopular: false,
    healthConcern: 'General Wellness'
  },
  {
    id: 'biopsy-16',
    name: 'Histopathology Biopsy (Small / Medium Specimen)',
    code: 'HIS-605',
    category: 'Histopathology & Cytology',
    sampleType: 'Tissue / Biopsy',
    fastingRequired: false,
    turnaroundTime: '3 - 5 Working Days',
    price: 1500,
    originalPrice: 2200,
    description: 'Detailed microscopic histopathological evaluation of tissue biopsy specimens by senior consultant pathologists with special stains as indicated.',
    parametersCount: 5,
    parametersList: ['Gross Specimen Description', 'Microscopic Histomorphology', 'Histological Grading & Margin Status', 'Diagnosis & Diagnostic Comment'],
    commonUses: 'Definitive diagnosis of suspicious lesions, mucosal polyps, surgical resections, and tumors.',
    preparationNotes: 'Specimen must be fixed immediately in 10% buffered neutral formalin accompanied by surgical notes.',
    isPopular: false,
    healthConcern: 'General Wellness'
  }
];

export const HEALTH_PACKAGES: HealthPackage[] = [
  {
    id: 'pkg-basic',
    name: 'Basic Health Checkup',
    tagline: 'Essential routine preventive screening for young adults and routine monitoring.',
    price: 999,
    originalPrice: 1999,
    discountPercentage: 50,
    parametersCount: 38,
    testsIncluded: [
      'Complete Blood Count (CBC with ESR - 24 Params)',
      'Fasting Blood Glucose',
      'Kidney Screen (Serum Creatinine, Blood Urea)',
      'Liver Screen (SGPT, SGOT, Bilirubin Total)',
      'Lipid Profile Screen (Cholesterol, Triglycerides)',
      'Urine Routine & Microscopic (18 Params)'
    ],
    categoryBreakdown: [
      { category: 'Hematology', count: 24, tests: ['CBC', 'ESR', 'Platelets', 'Hemoglobin'] },
      { category: 'Biochemistry', count: 6, tests: ['Fasting Sugar', 'Creatinine', 'Urea', 'SGPT', 'SGOT', 'Bilirubin'] },
      { category: 'Lipids', count: 2, tests: ['Total Cholesterol', 'Triglycerides'] },
      { category: 'Clinical Pathology', count: 6, tests: ['Urine Routine Physical & Chemical'] }
    ],
    idealFor: 'Annual health checkup for individuals aged 18–35 with no chronic symptoms.',
    fastingInfo: '10–12 hours overnight fasting mandatory.',
    isPopular: false,
    sampleTypes: ['Blood', 'Urine'],
    turnaroundTime: 'Same Day (8 Hours)',
    features: [
      '38 Vital Health Parameters',
      'Same-Day Digital Report Delivery',
      'Free Home Sample Collection Slot',
      'Basic Vital Trends Analysis'
    ]
  },
  {
    id: 'pkg-comprehensive',
    name: 'Comprehensive Health Checkup',
    tagline: 'Our most popular total-body assessment covering all vital organ systems.',
    price: 1999,
    originalPrice: 3999,
    discountPercentage: 50,
    parametersCount: 65,
    testsIncluded: [
      'Complete Blood Count (CBC with ESR - 24 Params)',
      'Complete Liver Function Test (LFT - 11 Params)',
      'Complete Kidney Function Test (KFT/RFT - 9 Params)',
      'Complete Lipid Profile Panel (8 Params)',
      'HbA1c & Fasting Blood Sugar (Diabetes Evaluation)',
      'Thyroid Profile Total (T3, T4, TSH)',
      'Urine Routine & Microscopic (18 Params)'
    ],
    categoryBreakdown: [
      { category: 'Hematology', count: 24, tests: ['Complete Hemogram', 'ESR'] },
      { category: 'Liver Function', count: 11, tests: ['SGOT', 'SGPT', 'Bilirubin Total/Direct', 'ALP', 'Proteins', 'Albumin'] },
      { category: 'Kidney Function', count: 9, tests: ['Creatinine', 'Urea', 'Uric Acid', 'Electrolytes'] },
      { category: 'Lipid Profile', count: 8, tests: ['Cholesterol', 'HDL', 'LDL', 'VLDL', 'Triglycerides'] },
      { category: 'Thyroid & Diabetes', count: 5, tests: ['T3', 'T4', 'TSH', 'HbA1c', 'Fasting Sugar'] },
      { category: 'Urinalysis', count: 8, tests: ['Urine Complete Profile'] }
    ],
    idealFor: 'Men and women aged 30+ seeking in-depth screening of heart, liver, kidney, and thyroid.',
    fastingInfo: '10–12 hours overnight fasting mandatory.',
    isPopular: true,
    sampleTypes: ['Blood', 'Urine'],
    turnaroundTime: 'Same Day (10 Hours)',
    features: [
      '65 Comprehensive Clinical Parameters',
      'Full Organ System Health Mapping',
      'Free Home Sample Collection',
      'Complimentary Doctor Report Counseling Notes',
      'Barcoded Sample Verification'
    ]
  },
  {
    id: 'pkg-advanced',
    name: 'Advanced Executive Wellness Package',
    tagline: 'Deep cellular, hormonal, metabolic, and micronutrient diagnostic screening.',
    price: 3499,
    originalPrice: 6999,
    discountPercentage: 50,
    parametersCount: 82,
    testsIncluded: [
      'All 65 Tests from Comprehensive Package',
      'Vitamin D 25-Hydroxy (Bone & Immune Status)',
      'Vitamin B12 (Neurological Health)',
      'Serum Ferritin & Iron Studies (Total Iron, TIBC, Transferrin Saturation)',
      'High-Sensitivity C-Reactive Protein (hs-CRP - Cardiac Risk)',
      'Serum Electrolytes Panel (Na+, K+, Cl-)',
      'Serum Uric Acid & Calcium Total'
    ],
    categoryBreakdown: [
      { category: 'Comprehensive Organs', count: 65, tests: ['CBC', 'LFT', 'KFT', 'Lipids', 'Thyroid', 'HbA1c'] },
      { category: 'Vitamins & Minerals', count: 8, tests: ['Vitamin D Total', 'Vitamin B12', 'Serum Iron', 'Ferritin', 'TIBC'] },
      { category: 'Cardiac & Inflammation', count: 3, tests: ['hs-CRP', 'Apolipoprotein Ratio Screen'] },
      { category: 'Metabolic & Electrolytes', count: 6, tests: ['Sodium', 'Potassium', 'Chloride', 'Calcium', 'Phosphorus'] }
    ],
    idealFor: 'Executives, active professionals, and seniors wanting an all-inclusive wellness roadmap.',
    fastingInfo: '10–12 hours overnight fasting mandatory.',
    isPopular: false,
    sampleTypes: ['Blood', 'Urine'],
    turnaroundTime: '24 Hours',
    features: [
      '82 Advanced Diagnostic Parameters',
      'Vitamins D & B12 + Complete Iron Profile',
      'Advanced Cardiac Inflammatory Marker (hs-CRP)',
      'Priority Laboratory Processing',
      'Free Home Collection with Cold-Chain Assurance'
    ]
  },
  {
    id: 'pkg-senior',
    name: 'Senior Citizen Complete Care',
    tagline: 'Tailored diagnostics addressing age-related joint, cardiovascular, kidney and metabolic concerns.',
    price: 2499,
    originalPrice: 4800,
    discountPercentage: 48,
    parametersCount: 72,
    testsIncluded: [
      'Complete Blood Count & ESR (Infection & Anemia)',
      'Full Liver & Renal Functional Profiles',
      'Lipid Profile & HbA1c with eAG',
      'Thyroid Profile (TSH)',
      'Serum Calcium, Phosphorus & Uric Acid (Joint & Bone Health)',
      'Vitamin D 25-Hydroxy',
      'Urine Routine & Microscopic Examination'
    ],
    categoryBreakdown: [
      { category: 'Vital Organs', count: 45, tests: ['CBC', 'LFT', 'KFT', 'Lipids'] },
      { category: 'Bone & Joints', count: 8, tests: ['Vitamin D', 'Calcium', 'Phosphorus', 'Uric Acid'] },
      { category: 'Metabolism', count: 5, tests: ['HbA1c', 'Fasting Sugar', 'TSH'] },
      { category: 'Urinalysis', count: 14, tests: ['Urine Microscopy & Chemistry'] }
    ],
    idealFor: 'Men and women aged 55+ needing regular monitoring for arthritis, diabetes, and heart health.',
    fastingInfo: '10–12 hours overnight fasting required.',
    isPopular: false,
    sampleTypes: ['Blood', 'Urine'],
    turnaroundTime: 'Same Day (10 Hours)',
    features: [
      '72 Senior-Specific Clinical Parameters',
      'Gentle Phlebotomy by Senior Technicians',
      'Home Sample Collection Priority Timing',
      'Large-Font Easy-to-Read Report Format'
    ]
  },
  {
    id: 'pkg-women',
    name: 'Women’s Wellness & Hormone Check',
    tagline: 'Specialized profile for hormonal harmony, bone vitality, iron stores, and metabolism.',
    price: 2699,
    originalPrice: 5200,
    discountPercentage: 48,
    parametersCount: 68,
    testsIncluded: [
      'Complete Hemogram with Iron Profile & Ferritin',
      'Complete Thyroid Profile (T3, T4, TSH)',
      'Vitamin D & Vitamin B12 Levels',
      'HbA1c & Fasting Glucose',
      'Kidney & Liver Function Screen',
      'Serum Calcium & Uric Acid',
      'Urine Routine & Microscopic'
    ],
    categoryBreakdown: [
      { category: 'Hormones & Thyroid', count: 4, tests: ['T3', 'T4', 'TSH', 'Metabolic Markers'] },
      { category: 'Vitamins & Iron', count: 6, tests: ['Vitamin D', 'Vitamin B12', 'Ferritin', 'Iron', 'TIBC'] },
      { category: 'Blood & Vital Organs', count: 48, tests: ['CBC', 'LFT', 'KFT', 'Lipid Screen'] },
      { category: 'Urinalysis', count: 10, tests: ['Urine Routine'] }
    ],
    idealFor: 'Women seeking proactive care for fatigue, PCOS monitoring, hair health, and bone support.',
    fastingInfo: '10–12 hours overnight fasting required.',
    isPopular: false,
    sampleTypes: ['Blood', 'Urine'],
    turnaroundTime: 'Same Day (10 Hours)',
    features: [
      '68 Targeted Health Indicators',
      'Comprehensive Iron & Ferritin Reserves',
      'Hormonal & Thyroid Baseline',
      'Home Sample Collection Available'
    ]
  },
  {
    id: 'pkg-diabetic',
    name: 'Diabetic Comprehensive Care Package',
    tagline: 'Quarterly and annual monitoring for diabetic management and target organ protection.',
    price: 1499,
    originalPrice: 2800,
    discountPercentage: 46,
    parametersCount: 52,
    testsIncluded: [
      'HbA1c Glycated Hemoglobin & Average Blood Glucose',
      'Fasting & Post-Prandial Blood Sugar',
      'Complete Kidney Function Test (eGFR, Creatinine, Microalbuminuria Screen)',
      'Lipid Profile (Cardiovascular Protection Panel)',
      'Liver Function Test Screen',
      'Complete Blood Count (CBC)',
      'Urine Routine with Microalbumin'
    ],
    categoryBreakdown: [
      { category: 'Diabetes Glycemia', count: 4, tests: ['HbA1c', 'eAG', 'Fasting Sugar', 'PP Sugar'] },
      { category: 'Renal Protection', count: 9, tests: ['Serum Creatinine', 'BUN', 'eGFR', 'Electrolytes'] },
      { category: 'Cardiovascular Lipids', count: 8, tests: ['Cholesterol', 'Triglycerides', 'HDL', 'LDL'] },
      { category: 'Routine Blood & Urine', count: 31, tests: ['CBC', 'Urine Routine & Microalbumin'] }
    ],
    idealFor: 'Individuals with type 1, type 2, or gestational diabetes, and pre-diabetic individuals.',
    fastingInfo: 'Requires both fasting sample and 2-hour post-meal (PP) sample.',
    isPopular: false,
    sampleTypes: ['Blood', 'Urine'],
    turnaroundTime: 'Same Day (8 Hours)',
    features: [
      '52 Diabetes-Specific Monitoring Parameters',
      'Dual Fasting & Post-Meal Sample Protocol',
      'Renal Filtration & Glomerular Health Tracking',
      'Automated Historical Trend Charts'
    ]
  }
];

export const DIAGNOSTIC_DEPARTMENTS: DiagnosticDepartment[] = [
  {
    id: 'dept-clinical-pathology',
    title: 'Clinical Pathology',
    subtitle: 'Microscopic and biochemical analysis of body fluids for accurate diagnostic insights.',
    description: 'Clinical pathology focuses on the diagnostic analysis of body fluids including urine, stool, cerebrospinal fluid (CSF), synovial fluid, and pleural fluid to detect cellular abnormalities, infections, and metabolic imbalances.',
    iconName: 'FlaskConical',
    imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80',
    keyHighlights: [
      'Fully automated urine chemistry and digital sediment analyzers',
      'High-precision body fluid microscopic evaluations',
      'Standardized sterile collection and handling protocols',
      'Rapid turnaround time for emergency fluid analysis'
    ],
    subcategories: [
      {
        title: 'Routine Urine Examination',
        description: 'Comprehensive evaluation of physical, chemical, and sediment parameters.',
        tests: ['Urine Routine & Microscopy', 'Urine Protein-Creatinine Ratio', '24-Hour Urine Chemistry', 'Bence Jones Proteins']
      },
      {
        title: 'Stool Examination',
        description: 'Screening for digestive malabsorption, occult GI bleeding, and parasitic infestations.',
        tests: ['Stool Routine Examination', 'Fecal Occult Blood Test (FOBT)', 'Stool Reducing Substances', 'Fecal Calprotectin']
      },
      {
        title: 'Body Fluid Analysis',
        description: 'Cell count, differential analysis, and biochemical screening of specialized fluids.',
        tests: ['Pleural Fluid Analysis', 'Ascitic / Peritoneal Fluid', 'Synovial Fluid Examination', 'Cerebrospinal Fluid (CSF) Analysis']
      }
    ],
    methodologyOverview: 'Employs computerized multi-wavelength reflectance spectrophotometry and automated flow cytometry imaging with manual microscopic review by certified pathologists.'
  },
  {
    id: 'dept-hematology',
    title: 'Hematology',
    subtitle: 'Automated 5-part and 6-part differential cell counting and coagulopathy screening.',
    description: 'Our hematology department investigates blood cellular components—red cells, white cells, platelets, and coagulation factors—to diagnose anemias, leukemias, clotting disorders, and systemic infections.',
    iconName: 'Activity',
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    keyHighlights: [
      'Advanced 5-part and 6-part automated hematology analyzers with fluorescence flow cytometry',
      'Expert peripheral blood smear examination for every atypical flag',
      'Automated mechanical and photo-optical coagulation testing',
      'Multi-level internal quality control (IQC) run every 8 hours'
    ],
    subcategories: [
      {
        title: 'Complete Hemogram & Cell Counts',
        description: 'High-resolution analysis of red blood cells, white blood cells, and platelets.',
        tests: ['Complete Blood Count (CBC)', 'Absolute Eosinophil Count (AEC)', 'Platelet Indices & MPV', 'Reticulocyte Count with IRF']
      },
      {
        title: 'Coagulation & Hemostasis',
        description: 'Assessing blood clotting cascade and anticoagulant therapy monitoring.',
        tests: ['Prothrombin Time (PT / INR)', 'Activated Partial Thromboplastin Time (APTT)', 'D-Dimer Quantitative', 'Fibrinogen']
      },
      {
        title: 'Special Hematology & Smears',
        description: 'Microscopic morphology and specialized diagnostic stains.',
        tests: ['Peripheral Blood Smear Examination', 'Malarial Parasite (MP Smear & Card)', 'Osmotic Fragility Test', 'Sickling Test / Hb Electrophoresis']
      }
    ],
    methodologyOverview: 'Combines semiconductor laser scatter, fluorescent flow cytometry, and automated barcoded tube handling for high-precision hematological diagnostics.'
  },
  {
    id: 'dept-biochemistry',
    title: 'Biochemistry',
    subtitle: 'High-throughput robotic clinical chemistry and metabolic profiling.',
    description: 'Clinical biochemistry examines enzymes, proteins, lipids, electrolytes, and hormones in blood serum and plasma to evaluate organ function, metabolic diseases, and therapeutic drug levels.',
    iconName: 'TestTube2',
    imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80',
    keyHighlights: [
      'High-throughput automated clinical chemistry analyzers with clot detection',
      'Direct ion-selective electrode (ISE) potentiometry for serum electrolytes',
      'Enzymatic and photometric assay validation with zero carryover',
      'Continuous temperature-controlled reagent carousels'
    ],
    subcategories: [
      {
        title: 'Metabolic & Organ Panels',
        description: 'Standardized comprehensive multi-parameter organ profiles.',
        tests: ['Liver Function Tests (LFT)', 'Kidney Function Tests (KFT / RFT)', 'Lipid Profile Panel', 'Pancreatic Amylase & Lipase']
      },
      {
        title: 'Diabetes & Glycemic Health',
        description: 'Precision measurement of short-term and long-term glucose dynamics.',
        tests: ['HbA1c by HPLC / Enzymatic Method', 'Fasting & Postprandial Blood Sugar', 'Oral Glucose Tolerance Test (OGTT)', 'Serum Insulin']
      },
      {
        title: 'Electrolytes, Minerals & Enzymes',
        description: 'Essential biochemical ions and specialized cardiac/skeletal enzymes.',
        tests: ['Electrolytes (Na+, K+, Cl-)', 'Calcium, Phosphorus & Magnesium', 'Cardiac Troponin-I / CPK-MB', 'Lactate Dehydrogenase (LDH)']
      }
    ],
    methodologyOverview: 'Equipped with robotic discrete multi-channel analyzers utilizing spectrophotometry, enzymatic colorimetric assays, and potentiometric ion detection.'
  },
  {
    id: 'dept-immunology-serology',
    title: 'Immunology & Serology',
    subtitle: 'Chemiluminescence (CLIA) and ELISA testing for hormones, antibodies, and infectious markers.',
    description: 'This department detects and quantifies antigen-antibody interactions in serum, providing critical answers for autoimmune conditions, infectious fevers, allergy panels, and endocrine status.',
    iconName: 'ShieldCheck',
    imageUrl: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=800&q=80',
    keyHighlights: [
      'Ultra-sensitive Chemiluminescence Immunoassay (CLIA) platforms',
      'Comprehensive viral marker screening (Hepatitis, HIV, Dengue, Chikungunya)',
      'Automated quantitative vitamin D & B12 chemiluminescent assays',
      'High-specificity allergy and autoimmune profile screening'
    ],
    subcategories: [
      {
        title: 'Infectious Disease Serology',
        description: 'Rapid and confirmatory serological detection of viral, bacterial, and vector-borne diseases.',
        tests: ['Dengue NS1 Antigen & Antibodies', 'Typhoid (Widal / Typhidot)', 'Hepatitis B Surface Antigen (HBsAg)', 'Anti-HCV Antibodies', 'HIV 1 & 2 Screening']
      },
      {
        title: 'Endocrinology & Thyroid',
        description: 'Ultrasensitive hormone quantification for metabolic and reproductive diagnostics.',
        tests: ['Thyroid Total & Free Profiles (FT3, FT4, TSH)', 'Cortisol', 'Prolactin', 'LH / FSH / Testosterone', 'Beta-hCG']
      },
      {
        title: 'Autoimmunity & Inflammatory Markers',
        description: 'Diagnostic panels for systemic lupus, rheumatoid arthritis, and chronic inflammation.',
        tests: ['Antinuclear Antibodies (ANA / IFA)', 'Rheumatoid Factor (RA)', 'Anti-CCP Antibodies', 'hs-CRP & Quantitative CRP', 'Procalcitonin']
      }
    ],
    methodologyOverview: 'Operates on automated magnetic particle chemiluminescence (CLIA) and microplate ELISA systems with calibrated cut-off thresholds.'
  },
  {
    id: 'dept-microbiology',
    title: 'Microbiology',
    subtitle: 'Microbial isolation, culture identification, and automated antimicrobial susceptibility.',
    description: 'Microbiology identifies pathogenic bacteria, fungi, and parasites from patient specimens and tests their sensitivity against antibiotics to guide rational medical therapy.',
    iconName: 'Microscope',
    imageUrl: 'https://images.unsplash.com/photo-1583912267670-6575ad4736f8?auto=format&fit=crop&w=800&q=80',
    keyHighlights: [
      'Dedicated biosafety level 2 culture rooms with laminar airflow workstations',
      'Automated continuous-monitoring blood culture systems',
      'Automated minimum inhibitory concentration (MIC) sensitivity testing',
      'Strict fungal and bacterial reference strain verification'
    ],
    subcategories: [
      {
        title: 'Bacterial & Fungal Cultures',
        description: 'Cultivation and isolation of organisms from diverse clinical sources.',
        tests: ['Urine Culture & Sensitivity', 'Blood Culture (Automated)', 'Sputum & Throat Swab Culture', 'Pus / Wound Swab Culture', 'Stool Culture']
      },
      {
        title: 'Special Stains & Microscopic Screening',
        description: 'Rapid direct smear staining for prompt preliminary insights.',
        tests: ['Gram Stain Examination', 'Ziehl-Neelsen (ZN) Acid Fast Stain for TB', 'KOH Mount for Fungal Elements', 'India Ink Preparation']
      },
      {
        title: 'Antimicrobial Resistance Surveillance',
        description: 'Standardized CLSI guidelines for antibiotic breakpoint reporting.',
        tests: ['Automated MIC Antibiotic Sensitivity', 'MRSA & ESBL Detection', 'Colistin & Carbapenem Sensitivity Panels']
      }
    ],
    methodologyOverview: 'Employs automated continuous-agitation incubation alongside selective agar media culture and automated phenotypic MIC testing.'
  },
  {
    id: 'dept-histopathology-cytology',
    title: 'Histopathology & Cytology',
    subtitle: 'Tissue biopsy processing, FNAC, and cervical cytology interpreted by expert pathologists.',
    description: 'Histopathology and Cytology examine tissue biopsies, cell aspirates, and scrapings to establish definitive diagnosis for benign vs. malignant conditions and inflammatory lesions.',
    iconName: 'Eye',
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
    keyHighlights: [
      'Automated vacuum tissue processors for optimal specimen embedding',
      'Precision microtomes yielding uniform 3–4 micron paraffin sections',
      'Liquid-Based Cytology (LBC) for enhanced cervical screening sensitivity',
      'Multi-pathologist consensus review for critical and oncology cases'
    ],
    subcategories: [
      {
        title: 'Histopathology (Biopsies & Resections)',
        description: 'Comprehensive microscopic tissue diagnosis from surgical specimens.',
        tests: ['Small Endoscopic Biopsy Examination', 'Medium & Large Surgical Resection Biopsy', 'Special Histochemical Stains', 'Frozen Section Consultations']
      },
      {
        title: 'Fine Needle Aspiration Cytology (FNAC)',
        description: 'Minimally invasive rapid cellular evaluation of palpable lumps.',
        tests: ['FNAC Thyroid / Lymph Node / Breast', 'Rapid On-Site Evaluation (ROSE)', 'Cell Block Preparations']
      },
      {
        title: 'Exfoliative & Liquid Cytology',
        description: 'Preventive and diagnostic screening for cellular dysplasia.',
        tests: ['Liquid Based Cytology (LBC) Pap Smear', 'Conventional Pap Smear', 'Sputum Cytology', 'Urine Cytology for Urothelial Cells']
      }
    ],
    methodologyOverview: 'Automated tissue fixation, dehydration, paraffin embedding, rotary microtomy, automated Hematoxylin & Eosin (H&E) staining, and high-aperture digital microscopy.'
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-fasting-guide',
    slug: 'how-to-prepare-for-fasting-blood-test-guide',
    title: 'How to Prepare for a Fasting Blood Test: The Complete Patient Guide',
    excerpt: 'Discover why 8 to 12 hours of fasting is vital for accurate blood glucose and lipid profile results, what you can drink, and common mistakes to avoid.',
    content: [
      'When your doctor prescribes a fasting blood test, it is not merely a formality—it is a physiological prerequisite. Certain biochemical components such as glucose, triglycerides, and certain enzymes fluctuate significantly right after food or beverage ingestion.',
      'Fasting allows the diagnostic laboratory to establish your baseline biochemical equilibrium, ensuring that reference ranges can be accurately compared against international clinical guidelines.',
      'What Does Fasting Actually Entail? For a standard Lipid Profile or Fasting Blood Sugar, fasting means consuming no food, coffee, tea, milk, or juices for 8 to 12 hours. Plain drinking water is generally permitted and encouraged, as adequate hydration makes venipuncture smoother.',
      'Common Mistakes to Avoid: Chewing gum (even sugar-free), drinking black coffee with artificial sweeteners, smoking, or taking strenuous early morning workouts can temporarily alter insulin sensitivity and lipid levels. If you take regular morning prescription medications, consult your doctor beforehand on whether to take them before or after the sample draw.'
    ],
    category: 'Test Preparation',
    author: 'Medical Advisory Team',
    authorRole: 'Microcells Laboratory Operations',
    date: 'August 10, 2026',
    readTime: '4 min read',
    imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    tags: ['Fasting', 'Patient Tips', 'Blood Tests', 'Lipid Profile', 'Blood Sugar'],
    keyTakeaways: [
      'Standard fasting requires 8–12 hours of strictly no food or caloric beverages.',
      'Plain drinking water is safe and keeps veins hydrated for comfortable sample collection.',
      'Avoid morning exercise and smoking prior to testing as they cause acute metabolic spikes.',
      'Always notify your phlebotomist about chronic medications you have taken.'
    ]
  },
  {
    id: 'blog-cbc-interpretation',
    slug: 'understanding-your-complete-blood-count-cbc-report',
    title: 'Understanding Your Complete Blood Count (CBC) Report: What the Numbers Mean',
    excerpt: 'Demystifying hemoglobin, WBC differential, MCV, and platelets so you can have more informed conversations with your consulting physician.',
    content: [
      'The Complete Blood Count (CBC) is the most frequently requested diagnostic investigation in modern medicine. It offers an instantaneous window into your bone marrow health, oxygen delivery capacity, and immune defense readiness.',
      'Red Blood Cell Parameters: Hemoglobin (Hb) reflects the oxygen-carrying protein in red cells. Packed Cell Volume (PCV/Hematocrit) indicates the percentage of whole blood composed of red cells. Red cell indices like MCV (Mean Corpuscular Volume) help differentiate iron deficiency anemia from B12/folate deficiency.',
      'White Blood Cells (The Body’s Defense): Total Leukocyte Count (TLC) increases during bacterial infections, tissue inflammation, or stress, while the differential count breaks down neutrophils (primary bacterial defenders), lymphocytes (viral immunity), eosinophils (allergies and parasites), and monocytes.',
      'Platelets & Clotting: Platelets are essential cell fragments that form plugs to halt bleeding. A healthy platelet count ranges between 150,000 and 450,000 per microliter. Viral illnesses such as dengue can temporarily cause platelets to dip, requiring close clinical monitoring.'
    ],
    category: 'Report Interpretation',
    author: 'Senior Pathologist Group',
    authorRole: 'Clinical Pathology Department',
    date: 'August 02, 2026',
    readTime: '6 min read',
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    tags: ['CBC', 'Hemoglobin', 'Blood Count', 'Platelets', 'Anemia'],
    keyTakeaways: [
      'Hemoglobin and MCV pinpoint the specific biological type of anemia.',
      'White blood cell differentials differentiate bacterial infections from viral reactions.',
      'Platelet counts maintain vascular integrity and must be monitored during febrile illnesses.',
      'Never self-diagnose; always review borderline values with a licensed physician.'
    ]
  },
  {
    id: 'blog-hba1c-vs-glucose',
    slug: 'hba1c-vs-daily-glucose-testing-what-diabetics-need-to-know',
    title: 'HbA1c vs. Daily Blood Glucose: What Diabetics Need to Know',
    excerpt: 'Why single-day finger-prick glucose checks and 3-month HbA1c tests complement each other in effective diabetes management.',
    content: [
      'Managing diabetes effectively requires both real-time snapshots and broad macro-level historical trends. Daily capillary glucose checks measure how food, exercise, and medication affect your body right now. In contrast, HbA1c provides a non-volatile 90-day biological average.',
      'How HbA1c Works: Red blood cells live for approximately 120 days. As glucose circulates in the bloodstream, a portion naturally binds to hemoglobin, creating glycated hemoglobin. The higher your blood glucose over weeks, the higher the percentage of glycated hemoglobin.',
      'Clinical Targets: For non-diabetics, normal HbA1c is below 5.7%. A level between 5.7% and 6.4% indicates prediabetes, while 6.5% or above on two separate tests confirms diabetes. For diagnosed diabetics, maintaining HbA1c below 7.0% significantly mitigates risks of retinopathy, nephropathy, and neuropathy.',
      'Why You Need Both: A patient might have a normal fasting glucose on testing day because they ate lightly the evening before, but a high HbA1c reveals chronic glycemic spikes that occurred over the preceding weeks.'
    ],
    category: 'Disease Awareness',
    author: 'Biochemistry Division',
    authorRole: 'Endocrine Diagnostic Unit',
    date: 'July 24, 2026',
    readTime: '5 min read',
    imageUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80',
    tags: ['Diabetes', 'HbA1c', 'Blood Sugar', 'Metabolism', 'Preventive Care'],
    keyTakeaways: [
      'HbA1c reflects average blood glucose control over the prior 2 to 3 months.',
      'Unlike fasting sugar, HbA1c is not affected by yesterday’s meals or stress.',
      'Routine testing every 3 to 6 months helps prevent diabetic complications.',
      'Estimated Average Glucose (eAG) translates HbA1c percentages into everyday mg/dL values.'
    ]
  },
  {
    id: 'blog-vitamind-deficiency',
    slug: 'vitamin-d-deficiency-symptoms-testing-optimal-levels',
    title: 'Vitamin D Deficiency: Symptoms, Diagnostic Testing, and Optimal Levels',
    excerpt: 'Learn why over 70% of urban populations have suboptimal Vitamin D levels, the limitations of diet alone, and when to get tested.',
    content: [
      'Vitamin D acts more like a potent neuroregulatory steroid hormone than a traditional dietary vitamin. It facilitates intestinal absorption of calcium, modulates innate and adaptive immunity, and supports skeletal muscle health.',
      'Why Urban Populations Are Deficient: Most vitamin D is synthesized when skin is exposed to UVB radiation from sunlight. With indoor work schedules, air pollution, and sunscreen use, endogenous synthesis is often severely suppressed.',
      'Subtle Symptoms of Deficiency: Unexplained chronic fatigue, persistent lower back and shin aches, frequent respiratory infections, poor wound healing, and mood fluctuations are common manifestations of low serum 25-OH Vitamin D.',
      'Interpreting Laboratory Ranges: Less than 20 ng/mL is clinically deficient; 20–30 ng/mL is insufficient; 30–100 ng/mL is optimal. Corrective supplementation should always be guided by laboratory quantification to avoid hypercalcemia.'
    ],
    category: 'Preventive Health',
    author: 'Medical Advisory Team',
    authorRole: 'Immunology Specialist',
    date: 'July 15, 2026',
    readTime: '4 min read',
    imageUrl: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=800&q=80',
    tags: ['Vitamin D', 'Immunity', 'Bone Health', 'Fatigue', 'Diagnostics'],
    keyTakeaways: [
      '25-Hydroxy Vitamin D is the definitive diagnostic marker for total body reserves.',
      'Target optimal levels between 30 and 60 ng/mL for metabolic and immune benefits.',
      'Dietary intake alone is rarely adequate; targeted therapeutic correction requires testing.',
      'Periodic monitoring prevents under-dosing and excessive supplementation.'
    ]
  },
  {
    id: 'blog-annual-checkup',
    slug: 'why-annual-preventative-health-screenings-save-lives',
    title: 'Why Annual Preventative Health Screenings Save Lives',
    excerpt: 'Many serious conditions—such as fatty liver, chronic kidney disease, hypertension, and early diabetes—develop silently without noticeable symptoms.',
    content: [
      'The modern medical philosophy has pivoted decisively from reactionary sick-care to proactive predictive wellness. The human body is remarkably resilient and often compensates for early organ stress without triggering noticeable pain or alarms.',
      'The Silent Progression: Early-stage fatty liver disease (NAFLD), borderline chronic kidney dysfunction, dyslipidemia, and subclinical hypothyroidism typically generate zero acute symptoms. By the time noticeable symptoms appear, organ damage may already be established.',
      'Economic and Health Dividends: Identifying elevated liver enzymes or rising microalbuminuria early allows for simple lifestyle modifications, dietary shifts, or mild interventions, avoiding costly hospitalizations and irreversible organ compromise.',
      'Choosing the Right Health Package: Young adults benefit from basic baseline panels, whereas individuals above 35 should opt for comprehensive full-body profiles including cardiac markers, thyroid panels, and renal filtration metrics.'
    ],
    category: 'Preventive Health',
    author: 'Quality Director',
    authorRole: 'Laboratory Standards Board',
    date: 'June 28, 2026',
    readTime: '5 min read',
    imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80',
    tags: ['Preventive Care', 'Health Packages', 'Annual Checkup', 'Wellness', 'Longevity'],
    keyTakeaways: [
      'Early organ stress frequently produces no outward symptoms.',
      'Annual routine checkups detect metabolic shifts years before clinical disease manifestations.',
      'Comprehensive packages offer holistic multi-organ evaluation at economical package rates.',
      'Serial annual tests create a valuable historical baseline of your biological trends.'
    ]
  },
  {
    id: 'blog-sample-journey',
    slug: 'the-journey-of-a-blood-sample-inside-pathology-lab',
    title: 'The Journey of a Blood Sample: Inside a Modern Pathology Lab',
    excerpt: 'Take a transparent look at the rigorous chain of custody, barcoding, automated analysis, and dual pathologist verification behind every test result.',
    content: [
      'Have you ever wondered what happens after your phlebotomist labels your blood vial and places it in the temperature-regulated transit box? Inside Microcells Diagnostics, every specimen follows a standardized, automated protocol designed to eliminate human error.',
      'Step 1 - Barcode Generation & Chain of Custody: At the moment of sample collection, unique alphanumeric 2D barcodes are generated and affixed in the presence of the patient, linking the specimen irrevocably to your electronic health record.',
      'Step 2 - Cold-Chain Transport & Accessioning: Samples travel in monitored thermal cool-boxes with continuous digital temperature loggers. Upon arrival at the central reference laboratory, samples are scanned and verified against pre-analytical quality criteria.',
      'Step 3 - Centrifugation & Automated Robotic Analysis: Blood is separated into serum or plasma at exact RPM speeds before robotic pipetting on multi-channel analyzers that execute automated internal quality control (IQC) calibrators.',
      'Step 4 - Technical Review & Pathologist Verification: If an analyzer detects any atypical flag, the sample is automatically scheduled for reflex manual slide review or repeat duplicate run before a consultant pathologist electronically signs and releases the digital report.'
    ],
    category: 'Lab Technology',
    author: 'Technical Operations Team',
    authorRole: 'Quality & Process Automation',
    date: 'June 10, 2026',
    readTime: '6 min read',
    imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80',
    tags: ['Lab Automation', 'Quality Control', 'Sample Tracking', 'Pathology Technology'],
    keyTakeaways: [
      'Unique barcode scanning eliminates sample mix-ups at every transit node.',
      'Cold-chain temperature loggers ensure biochemical specimen stability.',
      'Automated multi-level QC calibration runs verify analyzer accuracy daily.',
      'Consultant pathologists perform technical verification before report authorization.'
    ]
  }
];

export const FAQ_DATA: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'General & Booking',
    question: 'How can I book a pathology test with Microcells Diagnostics?',
    answer: 'You can book a test through multiple convenient channels: 1) Directly on this website by choosing your test or health package and selecting your preferred date and time; 2) Calling our centralized helpline at +91 98765 43210; 3) Messaging us on WhatsApp; or 4) Visiting any of our reference laboratory or collection centres in person.'
  },
  {
    id: 'faq-2',
    category: 'Home Sample Collection',
    question: 'Do you provide home sample collection, and what are the charges?',
    answer: 'Yes! We offer professional home sample collection across all serviced pin codes. Our trained phlebotomists arrive with sterile, single-use vacuum collection tubes and temperature-controlled cold-chain carrier boxes. Home sample collection is complimentary with most comprehensive health packages and available for a nominal fee for standalone routine tests.'
  },
  {
    id: 'faq-3',
    category: 'Online Reports',
    question: 'How and when can I access my diagnostic reports?',
    answer: 'Once your test is verified by our pathologists, you will receive an SMS and WhatsApp alert with a secure link. You can also view and download your full PDF report on our website using your unique Patient UHID and registered Mobile Number. Routine test reports are available on the same day within 4 to 8 hours.'
  },
  {
    id: 'faq-4',
    category: 'General & Booking',
    question: 'Can I book multiple tests and health packages together?',
    answer: 'Yes, our smart booking cart allows you to select multiple individual tests, organ panels, and health packages for yourself or multiple family members in a single scheduled appointment.'
  },
  {
    id: 'faq-5',
    category: 'Fasting & Preparation',
    question: 'Do I need to fast before my test, and for how many hours?',
    answer: 'Fasting requirements depend on the specific tests requested. Tests like Fasting Blood Sugar, Lipid Profile, Liver Function Tests, and Comprehensive Health Packages require 8 to 12 hours of overnight fasting. Routine CBC, Thyroid Total, HbA1c, and Vitamin D do not strictly require fasting unless combined with a lipid or fasting sugar panel. Plain water is permitted during fasting.'
  },
  {
    id: 'faq-6',
    category: 'Fasting & Preparation',
    question: 'Can I drink water or take my regular morning medications while fasting?',
    answer: 'Drinking plain water is allowed and recommended because good hydration assists vein visualization during blood drawing. If you take blood pressure, heart, or chronic prescription medications, you should generally take them with water, but please notify your phlebotomist or consulting doctor if you take insulin or oral diabetic medications.'
  },
  {
    id: 'faq-7',
    category: 'Quality & Safety',
    question: 'What quality control protocols are followed in your laboratory?',
    answer: 'Microcells Diagnostics adheres to standardized clinical laboratory procedures with 2-level and 3-level Internal Quality Controls (IQC) run daily on every automated instrument. We maintain barcoded end-to-end sample tracking, temperature-controlled cold-chain specimen transit, and consultant pathologist verification before digital report release.'
  },
  {
    id: 'faq-8',
    category: 'Home Sample Collection',
    question: 'Are your phlebotomists certified and trained for home collection?',
    answer: 'All our phlebotomists undergo rigorous clinical training in sterile venipuncture techniques, pediatric and geriatric sample collection, biosafety handling, and patient communication. They strictly use single-use sealed sterile needles and vacutainer systems opened in your presence.'
  },
  {
    id: 'faq-9',
    category: 'Online Reports',
    question: 'Can I get physical hard copies of my laboratory reports?',
    answer: 'Yes, while digital PDF reports with QR verification are instantly accessible online, you can collect signed physical hard copies from any of our laboratory branches or request hard-copy courier delivery during test booking.'
  },
  {
    id: 'faq-10',
    category: 'General & Booking',
    question: 'Can I upload my doctor’s prescription for test selection?',
    answer: 'Yes! If you have a doctor’s prescription note, simply click "Upload Prescription" on our homepage or booking portal. Our clinical desk team will review the prescription, map the exact tests requested, and assist you with slot booking.'
  },
  {
    id: 'faq-11',
    category: 'General & Booking',
    question: 'What payment methods do you accept for tests and home visits?',
    answer: 'We support multiple secure payment methods including UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, Net Banking, and Cash on collection at your doorstep or laboratory front desk.'
  },
  {
    id: 'faq-12',
    category: 'Quality & Safety',
    question: 'What is your procedure if a test result shows a critical or abnormal value?',
    answer: 'Our laboratory maintains a strict Critical Alert Protocol. When an automated analyzer detects panic-level values (e.g. critically low platelets, extreme electrolytes, or severe hyperglycemia), the sample is immediately verified, re-run in duplicate, and our senior clinical team attempts immediate telephone notification to the patient or referring physician.'
  }
];

export const FAQS = FAQ_DATA;

export const SAMPLE_PATIENT_REPORTS: PatientReportRecord[] = [
  {
    uhid: 'MC-2026-90412',
    billNo: 'INV-2026-8819',
    barcode: 'BC98210344',
    patientName: 'Pardeep Saini',
    age: 38,
    gender: 'Male',
    contactNumber: '+91 98765 43210',
    referredBy: 'Dr. R. K. Sharma, MD (Internal Medicine)',
    sampleCollectionDate: '17-Aug-2026 07:45 AM',
    reportingDate: '17-Aug-2026 02:15 PM',
    testName: 'Complete Hemogram (CBC) with ESR',
    category: 'Hematology',
    sampleType: 'EDPA Whole Blood',
    status: 'Ready',
    verifiedBy: 'Consultant Pathologist, MD (Path)',
    pathologistNotes: 'Red cell morphology shows normocytic normochromic picture. Platelets are adequate and well-distributed on peripheral smear. No atypical cells detected.',
    results: [
      { parameter: 'Hemoglobin (Hb)', value: '14.8', unit: 'g/dL', normalRange: '13.0 - 17.0', status: 'Normal', method: 'Spectrophotometry' },
      { parameter: 'Total Leukocyte Count (TLC)', value: '7,400', unit: '/cu.mm', normalRange: '4,000 - 11,000', status: 'Normal', method: 'Flow Cytometry' },
      { parameter: 'RBC Count', value: '4.95', unit: 'mill/cu.mm', normalRange: '4.50 - 5.50', status: 'Normal', method: 'Impedance' },
      { parameter: 'Packed Cell Volume (PCV)', value: '44.2', unit: '%', normalRange: '40.0 - 50.0', status: 'Normal', method: 'Calculated' },
      { parameter: 'Mean Corpuscular Volume (MCV)', value: '89.3', unit: 'fL', normalRange: '83.0 - 101.0', status: 'Normal', method: 'Calculated' },
      { parameter: 'Mean Corpuscular Hb (MCH)', value: '29.9', unit: 'pg', normalRange: '27.0 - 32.0', status: 'Normal', method: 'Calculated' },
      { parameter: 'MCHC', value: '33.5', unit: 'g/dL', normalRange: '31.5 - 34.5', status: 'Normal', method: 'Calculated' },
      { parameter: 'RDW - CV', value: '13.1', unit: '%', normalRange: '11.5 - 14.5', status: 'Normal', method: 'Calculated' },
      { parameter: 'Platelet Count', value: '2,65,000', unit: '/cu.mm', normalRange: '1,50,000 - 4,50,000', status: 'Normal', method: 'Direct Impedance' },
      { parameter: 'Neutrophils', value: '62', unit: '%', normalRange: '40 - 70', status: 'Normal', method: 'VCS Technology' },
      { parameter: 'Lymphocytes', value: '30', unit: '%', normalRange: '20 - 45', status: 'Normal', method: 'VCS Technology' },
      { parameter: 'Monocytes', value: '5', unit: '%', normalRange: '2 - 10', status: 'Normal', method: 'VCS Technology' },
      { parameter: 'Eosinophils', value: '3', unit: '%', normalRange: '1 - 6', status: 'Normal', method: 'VCS Technology' },
      { parameter: 'Basophils', value: '0', unit: '%', normalRange: '0 - 2', status: 'Normal', method: 'VCS Technology' },
      { parameter: 'ESR (Westergren Method)', value: '12', unit: 'mm / 1st hr', normalRange: '0 - 15', status: 'Normal', method: 'Westergren Automated' }
    ]
  },
  {
    uhid: 'MC-2026-88154',
    billNo: 'INV-2026-7901',
    barcode: 'BC98209112',
    patientName: 'Ananya Verma',
    age: 46,
    gender: 'Female',
    contactNumber: '+91 98111 22334',
    referredBy: 'Dr. S. Mukherjee, MD, DM (Endocrinology)',
    sampleCollectionDate: '16-Aug-2026 08:15 AM',
    reportingDate: '16-Aug-2026 01:45 PM',
    testName: 'Lipid Profile & Glycemic Screen',
    category: 'Biochemistry',
    sampleType: 'Serum & Fluoride Plasma',
    status: 'Ready',
    verifiedBy: 'Senior Consultant Biochemist',
    pathologistNotes: 'Mild elevation noted in serum total cholesterol and LDL fractions. HbA1c is within target prediabetes monitoring threshold. Clinical correlation with diet and exercise recommended.',
    results: [
      { parameter: 'Fasting Blood Sugar (Glucose)', value: '108', unit: 'mg/dL', normalRange: '70 - 100', status: 'High', flag: 'H', method: 'GOD-POD Enzymatic' },
      { parameter: 'HbA1c (Glycated Hemoglobin)', value: '5.9', unit: '%', normalRange: '< 5.7 Normal, 5.7-6.4 Prediabetes', status: 'High', flag: 'H', method: 'HPLC Method' },
      { parameter: 'Estimated Average Glucose (eAG)', value: '123', unit: 'mg/dL', normalRange: '< 117', status: 'High', flag: 'H', method: 'Calculated' },
      { parameter: 'Total Cholesterol', value: '218', unit: 'mg/dL', normalRange: '< 200 Desirable', status: 'High', flag: 'H', method: 'CHOD-PAP Enzymatic' },
      { parameter: 'Triglycerides', value: '165', unit: 'mg/dL', normalRange: '< 150 Normal', status: 'High', flag: 'H', method: 'GPO-PAP Enzymatic' },
      { parameter: 'HDL Cholesterol (Good)', value: '48', unit: 'mg/dL', normalRange: '> 50 Optimal', status: 'Low', flag: 'L', method: 'Direct Immunoinhibition' },
      { parameter: 'LDL Cholesterol (Calculated)', value: '137', unit: 'mg/dL', normalRange: '< 100 Optimal', status: 'High', flag: 'H', method: 'Friedewald Formula' },
      { parameter: 'VLDL Cholesterol', value: '33', unit: 'mg/dL', normalRange: '< 30', status: 'High', flag: 'H', method: 'Calculated' },
      { parameter: 'Total Chol / HDL Ratio', value: '4.54', unit: 'Ratio', normalRange: '< 4.0', status: 'High', flag: 'H', method: 'Calculated' }
    ]
  },
  {
    uhid: 'MC-2026-92100',
    billNo: 'INV-2026-9204',
    barcode: 'BC98214489',
    patientName: 'Vikramaditya Roy',
    age: 52,
    gender: 'Male',
    contactNumber: '+91 97777 88888',
    referredBy: 'Dr. A. K. Sen, MD (Nephrology)',
    sampleCollectionDate: '17-Aug-2026 11:30 AM',
    reportingDate: '17-Aug-2026 (In Progress)',
    testName: 'Kidney Function Test (KFT) & Electrolytes',
    category: 'Biochemistry',
    sampleType: 'Serum Clot Activator',
    status: 'Processing',
    verifiedBy: 'Pending Pathologist Review',
    pathologistNotes: 'Sample is undergoing secondary biochemical calibration and validation.',
    results: [
      { parameter: 'Serum Creatinine', value: '1.05', unit: 'mg/dL', normalRange: '0.70 - 1.30', status: 'Normal', method: 'Modified Jaffe' },
      { parameter: 'Blood Urea', value: '28', unit: 'mg/dL', normalRange: '15 - 45', status: 'Normal', method: 'GLDH Enzymatic' },
      { parameter: 'Serum Uric Acid', value: '5.8', unit: 'mg/dL', normalRange: '3.5 - 7.2', status: 'Normal', method: 'Uricase / POD' },
      { parameter: 'Serum Sodium (Na+)', value: '141', unit: 'mmol/L', normalRange: '136 - 145', status: 'Normal', method: 'Direct ISE' },
      { parameter: 'Serum Potassium (K+)', value: '4.3', unit: 'mmol/L', normalRange: '3.5 - 5.1', status: 'Normal', method: 'Direct ISE' }
    ]
  }
];

export const TRUST_POINTS = [
  {
    title: 'Standardized Accuracy',
    desc: 'Automated multi-level daily calibration with rigorous quality control standards.',
    iconName: 'Award'
  },
  {
    title: 'Advanced Technology',
    desc: 'High-throughput 6-part hematology and magnetic CLIA immunoassay analyzers.',
    iconName: 'Cpu'
  },
  {
    title: 'Experienced Pathologists',
    desc: 'Medical doctors and certified clinical biochemists reviewing every critical result.',
    iconName: 'UserCheck'
  },
  {
    title: 'Timely Digital Reports',
    desc: 'Rapid turnaround with secure online PDF access, SMS alerts, and WhatsApp delivery.',
    iconName: 'Clock'
  },
  {
    title: 'Safe Home Collection',
    desc: 'Trained, certified phlebotomists with sealed vacuum kits and cold-chain transport.',
    iconName: 'Home'
  },
  {
    title: 'Transparent & Patient-Centric',
    desc: 'Clear upfront pricing, no hidden charges, and structured test preparation guidance.',
    iconName: 'ShieldCheck'
  }
];
