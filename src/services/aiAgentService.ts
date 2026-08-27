import { AIChatMessage, AIAgentConfig, AISuggestedTest, TestItem, HealthPackage, LabInfo } from '../types';
import { detectDoctorOrMedicineAdvice, detectOffTopicQuery } from './aiKnowledgeScraper';

export const DEFAULT_AI_CONFIG: AIAgentConfig = {
  enabled: true,
  agentName: "Microcells Diagnostic AI Assistant",
  welcomeMessage: "Hello! I am your Microcells AI Health Advisor. Ask me anything about pathology tests, fasting guidelines, normal ranges, health packages, or symptoms. How can I help you today?",
  provider: 'auto',
  persona: 'pathologist',
  allowVoice: true,
  enableFloatingButton: true,
  suggestedPrompts: [
    "What tests require 10-12 hours fasting?",
    "Explain Complete Blood Count (CBC)",
    "What is the difference between HbA1c and Blood Sugar?",
    "What tests check Thyroid health?",
    "Which package is best for full body checkup?",
    "What causes elevated SGPT or SGOT in LFT?"
  ],
  additionalInstructions: "",
  strictWebsiteOnlyGuardrail: true,
  flagDoctorMedicineAdvice: true,
  contactDeskPhone: "+91 98765 43210",
  contactDeskWhatsapp: "+919876543210",
  contactDeskEmail: "contact@microcellsdiagnostics.com",
  contactDeskEmergency: "+91 98765 43211"
};

const STORAGE_KEY_CONFIG = 'microcells_ai_agent_config';
const STORAGE_KEY_HISTORY = 'microcells_ai_chat_history';

export const getStoredAiConfig = (): AIAgentConfig => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (raw) {
      return { ...DEFAULT_AI_CONFIG, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error("Failed to load stored AI config:", e);
  }
  return DEFAULT_AI_CONFIG;
};

export const saveStoredAiConfig = (config: AIAgentConfig): void => {
  try {
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
  } catch (e) {
    console.error("Failed to save AI config:", e);
  }
};

export const getStoredChatHistory = (): AIChatMessage[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error("Failed to load chat history:", e);
  }
  return [];
};

export const saveStoredChatHistory = (history: AIChatMessage[]): void => {
  try {
    // Keep maximum 30 messages in storage
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history.slice(-30)));
  } catch (e) {
    console.error("Failed to save chat history:", e);
  }
};

export const clearStoredChatHistory = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY_HISTORY);
  } catch (e) {
    console.error("Failed to clear chat history:", e);
  }
};

// Check server AI connectivity
export const checkAiServiceHealth = async (): Promise<{
  ok: boolean;
  providers?: {
    gemini?: { available: boolean; model: string };
    openai?: { available: boolean; model: string };
    localEngine?: { available: boolean; model: string };
  };
  serverTime?: string;
}> => {
  try {
    const res = await fetch('/api/ai/health');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return { ok: true, ...data };
  } catch (err) {
    console.warn("AI health check failed:", err);
    return {
      ok: false,
      providers: {
        localEngine: { available: true, model: "Microcells Offline Knowledge Engine" }
      }
    };
  }
};

// Send message to AI Agent endpoint
export const sendAiChatMessage = async (
  message: string,
  history: AIChatMessage[],
  testsCatalog: TestItem[],
  packagesCatalog: HealthPackage[],
  config: AIAgentConfig,
  contextOptions?: {
    websiteKnowledge?: string;
    labInfo?: Partial<LabInfo>;
  }
): Promise<{
  reply: string;
  suggestedTests?: AISuggestedTest[];
  source?: 'gemini' | 'openai' | 'pathology_engine';
  model?: string;
  isMedicalOrDrugAdvised?: boolean;
  isOffTopicBlocked?: boolean;
  showContactCard?: boolean;
  contactDeskInfo?: {
    phone: string;
    whatsapp: string;
    email: string;
    emergency: string;
  };
}> => {
  const contactDesk = {
    phone: config.contactDeskPhone || contextOptions?.labInfo?.phone || "+91 98765 43210",
    whatsapp: config.contactDeskWhatsapp || contextOptions?.labInfo?.whatsappNumber || "+919876543210",
    email: config.contactDeskEmail || contextOptions?.labInfo?.email || "contact@microcellsdiagnostics.com",
    emergency: config.contactDeskEmergency || contextOptions?.labInfo?.emergencyContact || "+91 98765 43211"
  };

  // Client-side quick guardrail check if configured
  if (config.flagDoctorMedicineAdvice !== false) {
    const medDetect = detectDoctorOrMedicineAdvice(message);
    if (medDetect.isAdvised) {
      // Find relevant diagnostic tests
      const relevantTests = testsCatalog.filter(t => 
        message.toLowerCase().includes(t.name.toLowerCase()) ||
        (t.category && message.toLowerCase().includes(t.category.toLowerCase()))
      ).slice(0, 3);

      return {
        reply: `⚠️ **Medical Prescription & Treatment Advisory Notice**\n\nAs an AI Clinical Assistant representing **Microcells Diagnostics**, I am strictly prohibited from prescribing medicines, recommending specific drug names (e.g. antibiotics, painkillers), or modifying medication dosages.\n\n**Clinical Safety Protocol:**\n• Medication prescriptions and therapeutic plans must always be evaluated and prescribed by a **registered medical practitioner / treating physician**.\n• Our pathology laboratory provides certified diagnostic blood & urine tests to help your doctor accurately assess clinical parameters before prescribing treatment.\n\n📞 **Contact Microcells Medical Helpdesk:**\n• Direct Helpline: **${contactDesk.phone}**\n• WhatsApp Medical Desk: **${contactDesk.whatsapp}**\n• Emergency Line: **${contactDesk.emergency}**\n\nBelow are relevant diagnostic tests that clinicians typically order to evaluate these symptoms:`,
        suggestedTests: (relevantTests.length > 0 ? relevantTests : testsCatalog.slice(0, 2)).map(t => ({
          id: t.id,
          name: t.name,
          code: t.code,
          price: t.price,
          sampleType: t.sampleType,
          fastingRequired: t.fastingRequired,
          type: 'test'
        })),
        isMedicalOrDrugAdvised: true,
        showContactCard: true,
        contactDeskInfo: contactDesk,
        source: 'pathology_engine',
        model: 'Microcells Clinical Guardrail Interceptor'
      };
    }
  }

  if (config.strictWebsiteOnlyGuardrail !== false) {
    const offTopicDetect = detectOffTopicQuery(message);
    if (offTopicDetect.isOffTopic) {
      return {
        reply: `🛡️ **Microcells Diagnostics AI Scope Limitation**\n\nI am the dedicated AI Diagnostic Assistant for **Microcells Diagnostics Pvt. Ltd.**\n\nTo ensure high clinical precision and safety, I am strictly sandboxed to assist with **Microcells pathology tests, health checkup packages, sample collection rules, fasting guidelines, lab timings, branches, and report downloads**.\n\nI cannot provide general trivia, coding solutions, entertainment commentary, or external non-diagnostic data.\n\nHow may I assist you with your diagnostic blood tests or health checkups today?`,
        suggestedTests: testsCatalog.slice(0, 2).map(t => ({
          id: t.id,
          name: t.name,
          code: t.code,
          price: t.price,
          sampleType: t.sampleType,
          fastingRequired: t.fastingRequired,
          type: 'test'
        })),
        isOffTopicBlocked: true,
        source: 'pathology_engine',
        model: 'Microcells Domain Sandbox'
      };
    }
  }

  try {
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        history: history.map(h => ({ role: h.role, content: h.content })),
        testsCatalog: testsCatalog.map(t => ({
          id: t.id,
          name: t.name,
          code: t.code,
          price: t.price,
          category: t.category,
          sampleType: t.sampleType,
          fastingRequired: t.fastingRequired,
          fastingHours: t.fastingHours,
          turnaroundTime: t.turnaroundTime,
          healthConcern: t.healthConcern
        })),
        packagesCatalog: packagesCatalog.map(p => ({
          id: p.id,
          name: p.name,
          price: p.price,
          parametersCount: p.parametersCount,
          tagline: p.tagline,
          idealFor: p.idealFor,
          fastingInfo: p.fastingInfo
        })),
        websiteKnowledge: contextOptions?.websiteKnowledge,
        labInfo: contextOptions?.labInfo,
        provider: config.provider,
        customApiKey: config.provider === 'chatgpt' ? config.customOpenAiKey : config.customGeminiKey,
        persona: config.persona,
        additionalInstructions: config.additionalInstructions,
        strictWebsiteOnlyGuardrail: config.strictWebsiteOnlyGuardrail ?? true,
        flagDoctorMedicineAdvice: config.flagDoctorMedicineAdvice ?? true
      }),
    });

    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }

    const data = await response.json();
    return {
      reply: data.reply || "I am currently processing your request. Please try asking again in a moment.",
      suggestedTests: data.suggestedTests || [],
      source: data.source || 'pathology_engine',
      model: data.model,
      isMedicalOrDrugAdvised: data.isMedicalOrDrugAdvised,
      isOffTopicBlocked: data.isOffTopicBlocked,
      showContactCard: data.showContactCard,
      contactDeskInfo: data.contactDeskInfo || (data.showContactCard ? contactDesk : undefined)
    };
  } catch (err: any) {
    console.error("sendAiChatMessage error:", err);
    
    // Offline / Network fallback helper
    return {
      reply: `**Diagnostic Guidance for: "${message}"**\n\nFor accurate diagnostic evaluation, our certified pathology laboratory at Microcells Diagnostics offers automated analysis with NABL quality compliance.\n\n• **Doorstep Sample Collection:** Available across the city\n• **Standard Fasting Guidance:** 10-12 hours overnight fasting is required for Lipid and Blood Glucose panels.\n• **Same-day Digital Reports:** Delivered securely to your email and online portal.\n\n*(Answered via Microcells On-Device Pathology Assistant)*`,
      suggestedTests: testsCatalog.slice(0, 3).map(t => ({
        id: t.id,
        name: t.name,
        code: t.code,
        price: t.price,
        sampleType: t.sampleType,
        fastingRequired: t.fastingRequired,
        type: 'test'
      })),
      source: 'pathology_engine'
    };
  }
};

// Fetch AI detailed profile for a test
export const fetchAiTestDetails = async (
  testName: string,
  testCode?: string,
  category?: string
): Promise<{ details: string; source: string }> => {
  try {
    const res = await fetch('/api/ai/test-details', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ testName, testCode, category })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return { details: data.details, source: data.source || 'gemini' };
  } catch (e) {
    console.error("fetchAiTestDetails error:", e);
    return {
      details: `**Clinical Purpose**\n${testName} evaluates physiological biomarkers to assist physicians in diagnosis, monitoring, and preventive health assessment.\n\n**Sample Requirements**\nVenous blood or specified body specimen.\n\n**Turnaround Time**\nSame Day (4 to 8 hours).`,
      source: 'pathology_engine'
    };
  }
};

// Browser Text-To-Speech helper
export const speakText = (text: string, onEnd?: () => void): void => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    // Clean markdown formatting for clean speech
    const cleanText = text.replace(/[*_#`~[\]()]/g, ' ').replace(/\n+/g, '. ').slice(0, 400);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    if (onEnd) utterance.onend = onEnd;
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn("Speech synthesis error:", e);
  }
};

export const stopSpeech = (): void => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};
