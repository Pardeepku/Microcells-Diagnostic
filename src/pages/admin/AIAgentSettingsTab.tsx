import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { 
  Bot, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  ShieldAlert, 
  Activity, 
  Save, 
  Plus, 
  Trash2, 
  Key, 
  MessageSquare, 
  Send,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Database,
  Lock,
  PhoneCall,
  FileText,
  Layers,
  HelpCircle
} from 'lucide-react';
import { checkAiServiceHealth, sendAiChatMessage } from '../../services/aiAgentService';
import { buildMicrocellsSLMKnowledgeContext } from '../../services/aiKnowledgeScraper';
import { AIChatMessage } from '../../types';

interface AIAgentSettingsTabProps {
  onShowToast: (msg: string) => void;
}

export const AIAgentSettingsTab: React.FC<AIAgentSettingsTabProps> = ({ onShowToast }) => {
  const { 
    aiConfig, 
    updateAiConfig, 
    tests, 
    packages, 
    faqs, 
    blogPosts, 
    labInfo, 
    siteContent, 
    customPages 
  } = useData();

  const [formData, setFormData] = useState({
    enabled: aiConfig.enabled ?? true,
    agentName: aiConfig.agentName || 'Microcells Diagnostic AI Assistant',
    welcomeMessage: aiConfig.welcomeMessage || '',
    provider: aiConfig.provider || 'auto',
    persona: aiConfig.persona || 'pathologist',
    allowVoice: aiConfig.allowVoice ?? true,
    enableFloatingButton: aiConfig.enableFloatingButton ?? true,
    customOpenAiKey: aiConfig.customOpenAiKey || '',
    customGeminiKey: aiConfig.customGeminiKey || '',
    additionalInstructions: aiConfig.additionalInstructions || '',
    suggestedPrompts: [...(aiConfig.suggestedPrompts || [])],
    strictWebsiteOnlyGuardrail: aiConfig.strictWebsiteOnlyGuardrail ?? true,
    flagDoctorMedicineAdvice: aiConfig.flagDoctorMedicineAdvice ?? true,
    contactDeskPhone: aiConfig.contactDeskPhone || labInfo?.phone || '+91 98765 43210',
    contactDeskWhatsapp: aiConfig.contactDeskWhatsapp || labInfo?.whatsappNumber || '+919876543210',
    contactDeskEmail: aiConfig.contactDeskEmail || labInfo?.email || 'contact@microcellsdiagnostics.com',
    contactDeskEmergency: aiConfig.contactDeskEmergency || labInfo?.emergencyContact || '+91 98765 43211'
  });

  const [newPrompt, setNewPrompt] = useState('');
  const [showOpenAiKey, setShowOpenAiKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    ok: boolean;
    providers?: any;
    pingTimeMs?: number;
    message?: string;
  } | null>(null);

  // Compile SLM website knowledge live for admin inspection
  const slmKnowledge = useMemo(() => {
    return buildMicrocellsSLMKnowledgeContext(
      labInfo,
      siteContent,
      tests,
      packages,
      faqs,
      blogPosts,
      customPages
    );
  }, [labInfo, siteContent, tests, packages, faqs, blogPosts, customPages]);

  // Admin interactive test sandbox
  const [sandboxQuery, setSandboxQuery] = useState('');
  const [sandboxMessages, setSandboxMessages] = useState<AIChatMessage[]>([
    {
      id: 'admin-test-init',
      role: 'assistant',
      content: '🧪 Microcells AI Sandbox Initialized.\n\nTry testing regular queries like "Do I need to fast for Lipid profile?", or test guardrail checks like "Which antibiotic should I take?" or "Who won the cricket match?".',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isSandboxLoading, setIsSandboxLoading] = useState(false);

  useEffect(() => {
    setFormData({
      enabled: aiConfig.enabled ?? true,
      agentName: aiConfig.agentName || 'Microcells Diagnostic AI Assistant',
      welcomeMessage: aiConfig.welcomeMessage || '',
      provider: aiConfig.provider || 'auto',
      persona: aiConfig.persona || 'pathologist',
      allowVoice: aiConfig.allowVoice ?? true,
      enableFloatingButton: aiConfig.enableFloatingButton ?? true,
      customOpenAiKey: aiConfig.customOpenAiKey || '',
      customGeminiKey: aiConfig.customGeminiKey || '',
      additionalInstructions: aiConfig.additionalInstructions || '',
      suggestedPrompts: [...(aiConfig.suggestedPrompts || [])],
      strictWebsiteOnlyGuardrail: aiConfig.strictWebsiteOnlyGuardrail ?? true,
      flagDoctorMedicineAdvice: aiConfig.flagDoctorMedicineAdvice ?? true,
      contactDeskPhone: aiConfig.contactDeskPhone || labInfo?.phone || '+91 98765 43210',
      contactDeskWhatsapp: aiConfig.contactDeskWhatsapp || labInfo?.whatsappNumber || '+919876543210',
      contactDeskEmail: aiConfig.contactDeskEmail || labInfo?.email || 'contact@microcellsdiagnostics.com',
      contactDeskEmergency: aiConfig.contactDeskEmergency || labInfo?.emergencyContact || '+91 98765 43211'
    });
  }, [aiConfig, labInfo]);

  const handleAddPrompt = () => {
    if (!newPrompt.trim()) return;
    setFormData({
      ...formData,
      suggestedPrompts: [...formData.suggestedPrompts, newPrompt.trim()]
    });
    setNewPrompt('');
  };

  const handleRemovePrompt = (index: number) => {
    const updated = formData.suggestedPrompts.filter((_, idx) => idx !== index);
    setFormData({ ...formData, suggestedPrompts: updated });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateAiConfig(formData);
    onShowToast('AI Agent & Guardrail configurations saved successfully!');
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    const start = performance.now();
    try {
      const health = await checkAiServiceHealth();
      const end = performance.now();
      setTestResult({
        ok: health.ok,
        providers: health.providers,
        pingTimeMs: Math.round(end - start),
        message: health.ok 
          ? 'Connected successfully to Microcells Diagnostic AI Platform.' 
          : 'Server AI service running in local pathology fallback mode.'
      });
    } catch (e: any) {
      setTestResult({
        ok: false,
        message: 'Could not connect to AI service: ' + e.message
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSandboxSend = async (customText?: string) => {
    const query = (customText || sandboxQuery).trim();
    if (!query || isSandboxLoading) return;

    const userMsg: AIChatMessage = {
      id: `admin-user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...sandboxMessages, userMsg];
    setSandboxMessages(newHistory);
    setSandboxQuery('');
    setIsSandboxLoading(true);

    try {
      const res = await sendAiChatMessage(
        userMsg.content,
        sandboxMessages,
        tests,
        packages,
        formData as any,
        {
          websiteKnowledge: slmKnowledge.summaryPrompt,
          labInfo: labInfo
        }
      );

      const aiMsg: AIChatMessage = {
        id: `admin-ai-${Date.now()}`,
        role: 'assistant',
        content: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedTests: res.suggestedTests,
        source: res.source,
        isMedicalOrDrugAdvised: res.isMedicalOrDrugAdvised,
        isOffTopicBlocked: res.isOffTopicBlocked,
        showContactCard: res.showContactCard,
        contactDeskInfo: res.contactDeskInfo
      };

      setSandboxMessages([...newHistory, aiMsg]);
    } catch (e: any) {
      setSandboxMessages([
        ...newHistory,
        {
          id: `admin-err-${Date.now()}`,
          role: 'assistant',
          content: 'Sandbox query failed: ' + e.message,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isError: true
        }
      ]);
    } finally {
      setIsSandboxLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-sky-950 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Small SLM Ecosystem & Safety Guardrails</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              AI Diagnostic Agent & ChatGPT Connection
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Trained on all Microcells catalog data, test prep guidelines, normal ranges, and pricing. Equipped with strict domain sandboxing and medical prescription interception.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <Activity className={`w-4 h-4 ${isTesting ? 'animate-spin text-teal-300' : 'text-teal-400'}`} />
              <span>{isTesting ? 'Testing Ping...' : 'Test AI Engine'}</span>
            </button>

            <button
              onClick={handleSave}
              className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-2xl shadow-lg shadow-teal-900/30 flex items-center gap-2 text-xs transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save AI Platform</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live SLM Knowledge Scraper Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-teal-50 text-teal-700 rounded-xl">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase">Tests Indexed</p>
            <p className="text-lg font-extrabold text-slate-900">{slmKnowledge.summaryStats.totalTests}</p>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-sky-50 text-sky-700 rounded-xl">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase">Packages Indexed</p>
            <p className="text-lg font-extrabold text-slate-900">{slmKnowledge.summaryStats.totalPackages}</p>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 text-amber-700 rounded-xl">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase">FAQs Indexed</p>
            <p className="text-lg font-extrabold text-slate-900">{slmKnowledge.summaryStats.totalFaqs}</p>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-700 rounded-xl">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase">Articles Indexed</p>
            <p className="text-lg font-extrabold text-slate-900">{slmKnowledge.summaryStats.totalBlogPosts}</p>
          </div>
        </div>
      </div>

      {/* Connection Test Result Alert */}
      {testResult && (
        <div className={`p-4 rounded-2xl border flex items-start gap-3 text-xs animate-in slide-in-from-top-2 duration-200 ${testResult.ok ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-amber-50 border-amber-200 text-amber-900'}`}>
          {testResult.ok ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 space-y-1">
            <p className="font-bold">{testResult.message}</p>
            {testResult.pingTimeMs && (
              <p className="text-[11px] opacity-80">
                Server Latency: {testResult.pingTimeMs}ms • Active engine: {testResult.providers?.gemini?.available ? 'Gemini 3.7 Flash' : testResult.providers?.openai?.available ? 'ChatGPT 4o-mini' : 'Local Clinical Knowledge Base'}
              </p>
            )}
          </div>
          <button
            onClick={() => setTestResult(null)}
            className="text-slate-400 hover:text-slate-700"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Grid: Settings & Live Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Form Settings (7 cols) */}
        <form onSubmit={handleSave} className="lg:col-span-7 space-y-6">
          
          {/* Card 1: Safety Guardrails & Policy Filters */}
          <div className="bg-white p-6 rounded-3xl border-2 border-teal-600/30 shadow-sm space-y-5 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-600" />
                Microcells SLM Safety Guardrails & Sandboxing
              </h3>
              <span className="text-[10px] font-bold bg-teal-100 text-teal-800 px-2.5 py-1 rounded-full">
                Active Protocol
              </span>
            </div>

            <div className="space-y-4">
              {/* Doctor / Medicine Advice Guardrail Toggle */}
              <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-amber-950">
                    <ShieldAlert className="w-4 h-4 text-amber-700" />
                    <span>Intercept Medical Advice & Drug Prescriptions</span>
                  </div>
                  <p className="text-[11px] text-amber-900/80 leading-relaxed">
                    Automatically blocks queries asking for medicines, antibiotic prescriptions, or drug dosages, flags them, and prompts the patient with a <strong>Direct Medical Desk / Contact Us</strong> card.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, flagDoctorMedicineAdvice: !formData.flagDoctorMedicineAdvice })}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors shrink-0 ${formData.flagDoctorMedicineAdvice ? 'bg-amber-600' : 'bg-slate-300'}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${formData.flagDoctorMedicineAdvice ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Strict Website Only Guardrail Toggle */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                    <Lock className="w-4 h-4 text-teal-700" />
                    <span>Strict Website & Pathology Sandboxing</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Prevents the AI from answering non-diagnostic, external, coding, or unrelated queries. All answers strictly grounded in Microcells tests, prices, timings, and prep guidelines.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, strictWebsiteOnlyGuardrail: !formData.strictWebsiteOnlyGuardrail })}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors shrink-0 ${formData.strictWebsiteOnlyGuardrail ? 'bg-teal-600' : 'bg-slate-300'}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${formData.strictWebsiteOnlyGuardrail ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            {/* Medical Helpdesk Contact Details for Flagged Inquiries */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-teal-600" />
                Medical Helpdesk & Doctor Referral Contact Info
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Direct Helpdesk Phone</label>
                  <input
                    type="text"
                    value={formData.contactDeskPhone}
                    onChange={(e) => setFormData({ ...formData, contactDeskPhone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">WhatsApp Desk Number</label>
                  <input
                    type="text"
                    value={formData.contactDeskWhatsapp}
                    onChange={(e) => setFormData({ ...formData, contactDeskWhatsapp: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                    placeholder="+919876543210"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Support Email</label>
                  <input
                    type="text"
                    value={formData.contactDeskEmail}
                    onChange={(e) => setFormData({ ...formData, contactDeskEmail: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                    placeholder="contact@microcellsdiagnostics.com"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">24/7 Lab Emergency Line</label>
                  <input
                    type="text"
                    value={formData.contactDeskEmergency}
                    onChange={(e) => setFormData({ ...formData, contactDeskEmergency: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                    placeholder="+91 98765 43211"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Core Configuration */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Bot className="w-4 h-4 text-teal-600" />
              General Agent Configuration
            </h3>

            {/* Toggle Switches */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                <div>
                  <p className="font-bold text-xs text-slate-800">Enable Floating Widget</p>
                  <p className="text-[11px] text-slate-500">Show bottom-right AI launcher</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, enableFloatingButton: !formData.enableFloatingButton })}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${formData.enableFloatingButton ? 'bg-teal-600' : 'bg-slate-300'}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${formData.enableFloatingButton ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                <div>
                  <p className="font-bold text-xs text-slate-800">Voice Speech Support</p>
                  <p className="text-[11px] text-slate-500">Enable mic input & audio read</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, allowVoice: !formData.allowVoice })}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${formData.allowVoice ? 'bg-teal-600' : 'bg-slate-300'}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${formData.allowVoice ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            {/* Agent Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                AI Assistant Display Name
              </label>
              <input
                type="text"
                value={formData.agentName}
                onChange={(e) => setFormData({ ...formData, agentName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="e.g. Microcells Diagnostic AI Assistant"
              />
            </div>

            {/* Persona */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Pathology Persona & Tone
              </label>
              <select
                value={formData.persona}
                onChange={(e) => setFormData({ ...formData, persona: e.target.value as any })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="pathologist">Senior Clinical Pathologist (Thorough, scientific, precise)</option>
                <option value="counselor">Patient Health Counselor (Friendly, easy to grasp, reassuring)</option>
                <option value="concierge">Lab Concierge & Booking Advisor (Action-oriented, prep guidelines)</option>
              </select>
            </div>

            {/* Welcome Message */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Initial Welcome Message
              </label>
              <textarea
                value={formData.welcomeMessage}
                onChange={(e) => setFormData({ ...formData, welcomeMessage: e.target.value })}
                rows={3}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                placeholder="Message shown when a patient opens the AI Agent..."
              />
            </div>
          </div>

          {/* Card 3: AI Provider & API Connection */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Zap className="w-4 h-4 text-sky-600" />
              AI Model Provider & ChatGPT Connection
            </h3>

            {/* Model Provider Options */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Selected AI Intelligence Provider
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div
                  onClick={() => setFormData({ ...formData, provider: 'auto' })}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${formData.provider === 'auto' ? 'border-sky-600 bg-sky-50/50' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                >
                  <p className="font-bold text-xs text-sky-950">Auto Hybrid</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Gemini 3.7 + Lab Engine</p>
                </div>

                <div
                  onClick={() => setFormData({ ...formData, provider: 'chatgpt' })}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${formData.provider === 'chatgpt' ? 'border-emerald-600 bg-emerald-50/50' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                >
                  <p className="font-bold text-xs text-emerald-950">ChatGPT / OpenAI</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">GPT-4o mini API</p>
                </div>

                <div
                  onClick={() => setFormData({ ...formData, provider: 'gemini' })}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${formData.provider === 'gemini' ? 'border-teal-600 bg-teal-50/50' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                >
                  <p className="font-bold text-xs text-teal-950">Gemini Direct</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Google GenAI SDK</p>
                </div>
              </div>
            </div>

            {/* OpenAI API Key Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-emerald-600" />
                  OpenAI / ChatGPT API Key (Optional)
                </label>
                <button
                  type="button"
                  onClick={() => setShowOpenAiKey(!showOpenAiKey)}
                  className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1"
                >
                  {showOpenAiKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  {showOpenAiKey ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                type={showOpenAiKey ? 'text' : 'password'}
                value={formData.customOpenAiKey}
                onChange={(e) => setFormData({ ...formData, customOpenAiKey: e.target.value })}
                placeholder="sk-proj-..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                If provided, all requests in ChatGPT mode will directly invoke OpenAI endpoints.
              </p>
            </div>

            {/* Custom Laboratory Directives */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Custom Laboratory Directives & Rules
              </label>
              <textarea
                value={formData.additionalInstructions}
                onChange={(e) => setFormData({ ...formData, additionalInstructions: e.target.value })}
                rows={3}
                placeholder="e.g. Always remind patients that home collection is free above ₹500, and highlight our same-day WhatsApp report delivery."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              />
            </div>
          </div>

          {/* Card 4: Quick Prompts List */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <MessageSquare className="w-4 h-4 text-amber-600" />
              Suggested Quick Prompts (Ribbon Chips)
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                value={newPrompt}
                onChange={(e) => setNewPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddPrompt();
                  }
                }}
                placeholder="e.g. What tests are included in Executive Full Body?"
                className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="button"
                onClick={handleAddPrompt}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {formData.suggestedPrompts.map((prompt, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-800 transition-colors"
                >
                  <span className="truncate pr-2">"{prompt}"</span>
                  <button
                    type="button"
                    onClick={() => handleRemovePrompt(idx)}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                    title="Remove prompt"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-2xl shadow-lg shadow-teal-900/20 text-xs flex items-center gap-2 cursor-pointer transition-all"
            >
              <Save className="w-4 h-4" />
              Save All AI Platform Settings
            </button>
          </div>
        </form>

        {/* Right Column: Live Interactive Admin Sandbox & Guardrail Tester (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[750px]">
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-400" />
                <span className="font-bold text-xs">Live Guardrail & AI Sandbox</span>
              </div>
              <span className="text-[10px] bg-teal-900 text-teal-300 px-2 py-0.5 rounded-full font-bold border border-teal-700">
                SLM Active
              </span>
            </div>

            {/* Quick Test Bench Buttons */}
            <div className="p-2.5 bg-slate-100 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[10px]">
              <span className="text-slate-500 font-bold uppercase shrink-0">Test Bench:</span>
              <button
                type="button"
                onClick={() => handleSandboxSend("Do I need to fast for Lipid profile test?")}
                className="px-2 py-1 bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-900 border border-slate-200 rounded-lg shrink-0 cursor-pointer"
              >
                🔬 Fasting Check
              </button>
              <button
                type="button"
                onClick={() => handleSandboxSend("Which antibiotic or medicine should I take for fever?")}
                className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold border border-amber-300 rounded-lg shrink-0 cursor-pointer"
              >
                ⚠️ Medicine Advice Test
              </button>
              <button
                type="button"
                onClick={() => handleSandboxSend("Who is the prime minister of Australia?")}
                className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium rounded-lg shrink-0 cursor-pointer"
              >
                🛡️ Off-Topic Block Test
              </button>
            </div>

            {/* Sandbox Message Stream */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 text-xs">
              {sandboxMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[92%] rounded-2xl px-3.5 py-2.5 leading-relaxed shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-sky-900 text-white rounded-tr-none'
                        : msg.isError
                          ? 'bg-rose-50 text-rose-900 border border-rose-200'
                          : 'bg-white text-slate-800 border border-slate-200'
                    }`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="flex items-center justify-between gap-2 mb-1 pb-1 border-b border-slate-100 text-[9px]">
                        <span className="font-bold text-teal-700 uppercase">
                          Engine: {msg.source || 'Pathology SLM'}
                        </span>
                        {msg.isMedicalOrDrugAdvised && (
                          <span className="px-1.5 py-0.5 bg-amber-100 text-amber-900 font-bold rounded">
                            ⚠️ Medicine Flagged
                          </span>
                        )}
                        {msg.isOffTopicBlocked && (
                          <span className="px-1.5 py-0.5 bg-slate-200 text-slate-800 font-bold rounded">
                            🛡️ Sandboxed
                          </span>
                        )}
                      </div>
                    )}
                    <p className="whitespace-pre-wrap">{msg.content}</p>

                    {(msg.isMedicalOrDrugAdvised || msg.showContactCard) && (
                      <div className="mt-2 p-2 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-950 font-medium">
                        📞 Medical Desk Active: {formData.contactDeskPhone} • WhatsApp: {formData.contactDeskWhatsapp}
                      </div>
                    )}

                    {msg.suggestedTests && msg.suggestedTests.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-slate-100 space-y-1">
                        <p className="text-[9px] font-bold text-slate-500">Suggested Action Items:</p>
                        {msg.suggestedTests.map((st) => (
                          <div key={st.id} className="text-[10px] bg-slate-50 p-1 rounded border border-slate-200 flex justify-between">
                            <span className="font-semibold text-slate-700 truncate">{st.name}</span>
                            <span className="font-bold text-teal-700">₹{st.price}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-[8px] text-slate-400 mt-0.5 px-1">{msg.timestamp}</span>
                </div>
              ))}

              {isSandboxLoading && (
                <div className="flex items-center gap-2 bg-white text-slate-500 border border-slate-200 px-3 py-2 rounded-2xl text-xs animate-pulse">
                  <Sparkles className="w-3 h-3 text-teal-500 animate-spin" />
                  <span>Consulting Microcells SLM knowledge base...</span>
                </div>
              )}
            </div>

            {/* Sandbox Input Form */}
            <div className="p-3 bg-white border-t border-slate-200">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={sandboxQuery}
                  onChange={(e) => setSandboxQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSandboxSend();
                    }
                  }}
                  placeholder="Test query (e.g. 'Thyroid test instructions')..."
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  type="button"
                  onClick={() => handleSandboxSend()}
                  disabled={!sandboxQuery.trim() || isSandboxLoading}
                  className="p-2.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white rounded-xl cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
