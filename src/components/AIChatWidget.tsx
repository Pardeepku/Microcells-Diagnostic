import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { 
  AIChatMessage, 
  AISuggestedTest, 
  TestItem, 
  HealthPackage, 
  CartItem 
} from '../types';
import { 
  sendAiChatMessage, 
  getStoredChatHistory, 
  saveStoredChatHistory, 
  clearStoredChatHistory,
  checkAiServiceHealth,
  speakText,
  stopSpeech
} from '../services/aiAgentService';
import { buildMicrocellsSLMKnowledgeContext } from '../services/aiKnowledgeScraper';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  Trash2, 
  Settings2, 
  Check, 
  Copy, 
  ShoppingBag, 
  Calendar, 
  Activity, 
  ShieldCheck, 
  ShieldAlert, 
  PhoneCall, 
  MessageCircle, 
  Lock, 
  ArrowRight,
  ExternalLink,
  Info,
  Zap
} from 'lucide-react';

interface AIChatWidgetProps {
  onBookTest?: (item: TestItem | HealthPackage) => void;
  onAddToCart?: (item: CartItem) => void;
  onNavigate?: (page: any) => void;
}

export const AIChatWidget: React.FC<AIChatWidgetProps> = ({
  onBookTest,
  onAddToCart,
  onNavigate
}) => {
  const { 
    tests, 
    packages, 
    faqs,
    blogPosts,
    labInfo,
    siteContent,
    customPages,
    aiConfig, 
    updateAiConfig, 
    isAiDrawerOpen, 
    setAiDrawerOpen, 
    activeAiPrompt, 
    triggerAiPrompt 
  } = useData();

  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeakingId, setIsSpeakingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [connectionHealth, setConnectionHealth] = useState<{
    ok: boolean;
    providers?: any;
  } | null>(null);
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const speechRecognitionRef = useRef<any>(null);

  // Extract and compile the live website SLM domain knowledge
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

  // Initialize chat history and welcome message
  useEffect(() => {
    const saved = getStoredChatHistory();
    if (saved && saved.length > 0) {
      setMessages(saved);
    } else {
      const initialWelcome: AIChatMessage = {
        id: 'welcome-msg',
        role: 'assistant',
        content: aiConfig.welcomeMessage || "Hello! I am your Microcells Diagnostic AI Assistant. Ask me anything about any pathology test, fasting requirements, organ profiles, or health checkups.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'gemini'
      };
      setMessages([initialWelcome]);
      saveStoredChatHistory([initialWelcome]);
    }
  }, [aiConfig.welcomeMessage]);

  // Handle external activeAiPrompt trigger (e.g. from test card "Ask AI")
  useEffect(() => {
    if (activeAiPrompt) {
      handleSendMessage(activeAiPrompt);
    }
  }, [activeAiPrompt]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (isAiDrawerOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isAiDrawerOpen, isLoading]);

  // Check health on settings open
  useEffect(() => {
    if (showSettings) {
      handleTestConnection();
    }
  }, [showSettings]);

  // Setup Web Speech API if supported
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputQuery(transcript);
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        speechRecognitionRef.current = recognition;
      }
    }
  }, []);

  const handleToggleListening = () => {
    if (!speechRecognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please type your query.");
      return;
    }
    if (isListening) {
      speechRecognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        speechRecognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error("Speech start error:", err);
      }
    }
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    try {
      const health = await checkAiServiceHealth();
      setConnectionHealth(health);
    } catch (e) {
      setConnectionHealth({ ok: false });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isLoading) return;

    const userMessage: AIChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    saveStoredChatHistory(newHistory);
    setInputQuery('');
    setIsLoading(true);

    try {
      const res = await sendAiChatMessage(
        query, 
        messages, 
        tests, 
        packages, 
        aiConfig,
        {
          websiteKnowledge: slmKnowledge.summaryPrompt,
          labInfo: labInfo
        }
      );
      
      const assistantMessage: AIChatMessage = {
        id: `ai-${Date.now()}`,
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

      const updatedWithAi = [...newHistory, assistantMessage];
      setMessages(updatedWithAi);
      saveStoredChatHistory(updatedWithAi);

      // Auto speech if enabled
      if (aiConfig.allowVoice && isSpeakingId === 'auto') {
        speakText(res.reply);
      }
    } catch (err) {
      const errorMessage: AIChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: "I apologize, but I encountered a momentary connection issue. Please check your internet connection or try asking again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm("Clear diagnostic chat history?")) {
      clearStoredChatHistory();
      stopSpeech();
      const resetMsg: AIChatMessage = {
        id: 'welcome-reset',
        role: 'assistant',
        content: aiConfig.welcomeMessage || "Hello! I am your Microcells Diagnostic AI Assistant. Ask me anything about any pathology test, fasting requirements, organ profiles, or health checkups.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'gemini'
      };
      setMessages([resetMsg]);
      saveStoredChatHistory([resetMsg]);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleSpeech = (id: string, text: string) => {
    if (isSpeakingId === id) {
      stopSpeech();
      setIsSpeakingId(null);
    } else {
      setIsSpeakingId(id);
      speakText(text, () => setIsSpeakingId(null));
    }
  };

  const handleActionBook = (item: AISuggestedTest) => {
    if (item.type === 'package') {
      const pkg = packages.find(p => p.id === item.id) || {
        id: item.id,
        name: item.name,
        price: item.price,
        originalPrice: item.price + 500,
        discountPercent: 15,
        totalTests: 50,
        category: 'Full Body & Preventive',
        sampleType: 'Blood & Urine',
        fastingRequired: true,
        tagline: 'Comprehensive organ health evaluation',
        popular: true,
        testsIncluded: ['CBC', 'Lipid', 'LFT', 'KFT', 'Thyroid']
      };
      if (onBookTest) onBookTest(pkg as HealthPackage);
    } else {
      const test = tests.find(t => t.id === item.id) || {
        id: item.id,
        name: item.name,
        code: item.code || 'MCD-01',
        price: item.price,
        category: 'Biochemistry & Clinical Chemistry',
        sampleType: item.sampleType || 'Blood',
        fastingRequired: item.fastingRequired || false,
        turnaroundTime: 'Same Day',
        isPopular: true
      };
      if (onBookTest) onBookTest(test as TestItem);
    }
  };

  const handleActionAddToCart = (item: AISuggestedTest) => {
    if (onAddToCart) {
      onAddToCart({
        id: item.id,
        name: item.name,
        type: item.type || 'test',
        price: item.price,
        sampleType: item.sampleType,
        fastingRequired: item.fastingRequired
      });
    }
  };

  // If floating button is disabled in lab settings
  if (!aiConfig.enableFloatingButton && !isAiDrawerOpen) {
    return null;
  }

  return (
    <>
      {/* Floating Launcher Button */}
      {!isAiDrawerOpen && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3 no-print animate-in fade-in zoom-in duration-300">
          <div 
            onClick={() => setAiDrawerOpen(true)}
            className="hidden sm:flex items-center gap-2 bg-slate-900/90 backdrop-blur-md text-white px-3.5 py-2 rounded-2xl shadow-xl border border-teal-500/30 text-xs font-medium cursor-pointer hover:border-teal-400 transition-all group"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
            <span>Ask AI about any test</span>
            <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </div>

          <button
            id="ai-agent-floating-btn"
            onClick={() => setAiDrawerOpen(true)}
            className="relative p-3.5 bg-gradient-to-tr from-teal-600 via-sky-600 to-teal-500 text-white rounded-2xl shadow-2xl shadow-teal-900/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer group ring-4 ring-white/50"
            title="Ask Microcells Diagnostic AI Agent"
          >
            {/* Pulsing Aura */}
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-teal-300 border-2 border-white"></span>
            </span>

            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6 text-white group-hover:rotate-6 transition-transform" />
              <span className="hidden md:inline font-bold text-xs pr-1">AI Test Advisor</span>
            </div>
          </button>
        </div>
      )}

      {/* AI Assistant Chat Drawer / Modal */}
      {isAiDrawerOpen && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 flex flex-col w-full sm:w-[440px] h-full sm:h-[620px] sm:max-h-[85vh] bg-white sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-6 duration-300">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-sky-900 via-teal-900 to-sky-950 text-white px-5 py-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full absolute -bottom-0.5 -right-0.5 ring-2 ring-sky-950"></span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-white tracking-wide">
                    {aiConfig.agentName || "Microcells AI Agent"}
                  </h3>
                  <span className="text-[10px] bg-teal-400/20 text-teal-200 px-1.5 py-0.5 rounded-full border border-teal-400/30 flex items-center gap-1 font-medium">
                    <Sparkles className="w-2.5 h-2.5" />
                    Live
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 flex items-center gap-1.5 mt-0.5">
                  <ShieldCheck className="w-3 h-3 text-teal-400" />
                  Pathology & Test Intelligence Platform
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-xl transition-colors ${showSettings ? 'bg-white/20 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}
                title="AI Agent Connection & Settings"
              >
                <Settings2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleClearHistory}
                className="p-2 text-slate-300 hover:bg-white/10 hover:text-white rounded-xl transition-colors"
                title="Clear Chat History"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  stopSpeech();
                  setAiDrawerOpen(false);
                }}
                className="p-2 text-slate-300 hover:bg-white/10 hover:text-white rounded-xl transition-colors"
                title="Minimize AI Agent"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Settings Panel (Toggleable) */}
          {showSettings && (
            <div className="bg-slate-50 border-b border-slate-200 p-4 text-xs space-y-3 animate-in slide-in-from-top-2 duration-200 max-h-[300px] overflow-y-auto">
              <div className="flex items-center justify-between font-bold text-slate-800 border-b border-slate-200 pb-1.5">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-teal-600" />
                  AI Agent Connection Platform
                </span>
                <span className="text-[10px] text-slate-500 font-normal">Provider & Engine</span>
              </div>

              {/* Provider Selection */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Active AI Model Provider
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => updateAiConfig({ provider: 'auto' })}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-medium border text-center transition-all ${aiConfig.provider === 'auto' ? 'bg-sky-900 text-white border-sky-900 shadow-sm' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'}`}
                  >
                    Auto (Gemini 3.7)
                  </button>
                  <button
                    type="button"
                    onClick={() => updateAiConfig({ provider: 'chatgpt' })}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-medium border text-center transition-all ${aiConfig.provider === 'chatgpt' ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'}`}
                  >
                    ChatGPT / OpenAI
                  </button>
                  <button
                    type="button"
                    onClick={() => updateAiConfig({ provider: 'gemini' })}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-medium border text-center transition-all ${aiConfig.provider === 'gemini' ? 'bg-teal-700 text-white border-teal-700 shadow-sm' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'}`}
                  >
                    Gemini Direct
                  </button>
                </div>
              </div>

              {/* Custom API Key if ChatGPT chosen */}
              {aiConfig.provider === 'chatgpt' && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    OpenAI / ChatGPT API Key (Optional Override)
                  </label>
                  <input
                    type="password"
                    value={aiConfig.customOpenAiKey || ''}
                    onChange={(e) => updateAiConfig({ customOpenAiKey: e.target.value })}
                    placeholder="sk-proj-..."
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                  />
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Leave blank to use default server AI connection.
                  </p>
                </div>
              )}

              {/* Persona Selection */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  AI Pathologist Persona
                </label>
                <select
                  value={aiConfig.persona}
                  onChange={(e) => updateAiConfig({ persona: e.target.value as any })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
                >
                  <option value="pathologist">Chief Clinical Pathologist (Scientific, Detailed & Accurate)</option>
                  <option value="counselor">Patient Health Counselor (Warm, Simple & Supportive)</option>
                  <option value="concierge">Lab Concierge (Focused on Preparation, Fasting & Booking)</option>
                </select>
              </div>

              {/* Voice toggle */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-700 text-xs">Audio Speech-to-Text & Output</span>
                <button
                  type="button"
                  onClick={() => updateAiConfig({ allowVoice: !aiConfig.allowVoice })}
                  className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${aiConfig.allowVoice ? 'bg-teal-600' : 'bg-slate-300'}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${aiConfig.allowVoice ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Test Connection Button */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTestingConnection}
                  className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-medium text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Activity className={`w-3 h-3 ${isTestingConnection ? 'animate-spin' : 'text-teal-600'}`} />
                  {isTestingConnection ? 'Testing Latency...' : 'Test AI Connection'}
                </button>
                {connectionHealth && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${connectionHealth.ok ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {connectionHealth.ok ? '✓ Connected to Microcells AI' : 'Offline Knowledge Active'}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Quick Prompts Ribbon (Always available) */}
          <div className="bg-slate-50/90 border-b border-slate-200 px-3 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0 flex items-center gap-1 pl-1">
              <Sparkles className="w-2.5 h-2.5 text-teal-600" />
              Quick:
            </span>
            {(aiConfig.suggestedPrompts || []).map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                disabled={isLoading}
                className="shrink-0 px-2.5 py-1 bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-900 rounded-lg border border-slate-200 hover:border-teal-300 text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Message List */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/40">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              const isSpeaking = isSpeakingId === msg.id;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-in fade-in duration-200`}
                >
                  <div
                    className={`max-w-[90%] sm:max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm ${
                      isUser
                        ? 'bg-sky-900 text-white rounded-tr-none'
                        : msg.isError
                          ? 'bg-rose-50 text-rose-900 border border-rose-200 rounded-tl-none'
                          : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'
                    }`}
                  >
                    {/* Assistant Message Header / Source */}
                    {!isUser && (
                      <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-slate-100 text-[10px] text-slate-400 font-medium">
                        <span className="flex items-center gap-1 text-teal-700 font-bold">
                          <Bot className="w-3 h-3 text-teal-600" />
                          {msg.source === 'openai' ? 'ChatGPT 4o-mini' : msg.source === 'gemini' ? 'Gemini 3.7 Flash' : 'Microcells Diagnostic Engine'}
                        </span>
                        <div className="flex items-center gap-1">
                          {msg.isMedicalOrDrugAdvised && (
                            <span className="px-1.5 py-0.5 bg-amber-100 text-amber-900 rounded font-semibold text-[9px] flex items-center gap-0.5">
                              <ShieldAlert className="w-2.5 h-2.5 text-amber-700" />
                              Advisory Flagged
                            </span>
                          )}
                          {msg.isOffTopicBlocked && (
                            <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded font-semibold text-[9px] flex items-center gap-0.5">
                              <Lock className="w-2.5 h-2.5 text-slate-500" />
                              Sandboxed
                            </span>
                          )}
                          <button
                            onClick={() => handleToggleSpeech(msg.id, msg.content)}
                            className="hover:text-slate-700 p-0.5 rounded transition-colors"
                            title={isSpeaking ? "Stop speech" : "Read aloud"}
                          >
                            {isSpeaking ? (
                              <VolumeX className="w-3 h-3 text-teal-600 animate-pulse" />
                            ) : (
                              <Volume2 className="w-3 h-3" />
                            )}
                          </button>
                          <button
                            onClick={() => handleCopyText(msg.id, msg.content)}
                            className="hover:text-slate-700 p-0.5 rounded transition-colors"
                            title="Copy response"
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Message Body with clean paragraph & bullet formatting */}
                    <div className="space-y-1.5 whitespace-pre-wrap font-sans">
                      {msg.content}
                    </div>

                    {/* Dedicated Doctor / Medicine Advice Notice Card */}
                    {(msg.isMedicalOrDrugAdvised || msg.showContactCard) && (
                      <div className="mt-3 p-3 bg-gradient-to-br from-amber-50 to-orange-50/80 rounded-xl border border-amber-300 text-slate-800 shadow-sm animate-in fade-in duration-300">
                        <div className="flex items-start gap-2">
                          <div className="p-1.5 bg-amber-200/80 rounded-lg text-amber-900 shrink-0 mt-0.5">
                            <ShieldAlert className="w-4 h-4 text-amber-800" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-amber-950">
                              Direct Doctor & Medical Helpdesk
                            </h4>
                            <p className="text-[11px] text-amber-900/90 mt-0.5 leading-relaxed">
                              Medications must be prescribed by a physician following lab diagnosis. Contact our certified medical support desk:
                            </p>
                          </div>
                        </div>

                        {/* Interactive Direct Contact Buttons */}
                        <div className="mt-2.5 pt-2 border-t border-amber-200/60 grid grid-cols-2 gap-1.5">
                          <a
                            href={`tel:${msg.contactDeskInfo?.phone || labInfo?.phone || '+919876543210'}`}
                            className="flex items-center justify-center gap-1.5 py-1.5 px-2.5 bg-white hover:bg-amber-100 text-amber-950 font-bold text-[11px] rounded-lg border border-amber-300 shadow-xs transition-colors"
                          >
                            <PhoneCall className="w-3 h-3 text-amber-800" />
                            <span>Call Desk</span>
                          </a>

                          <a
                            href={`https://wa.me/${(msg.contactDeskInfo?.whatsapp || labInfo?.whatsappNumber || '919876543210').replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello Microcells Diagnostics, I have an inquiry regarding physician consultation and diagnostic tests.')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-1.5 py-1.5 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg shadow-xs transition-colors"
                          >
                            <MessageCircle className="w-3 h-3" />
                            <span>WhatsApp</span>
                          </a>
                        </div>

                        {msg.contactDeskInfo?.emergency && (
                          <div className="mt-2 text-[10px] text-amber-800 flex items-center justify-between font-medium px-1">
                            <span>🚨 24/7 Lab Emergency:</span>
                            <span className="font-bold">{msg.contactDeskInfo.emergency}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Off-Topic sandbox indicator */}
                    {msg.isOffTopicBlocked && (
                      <div className="mt-2.5 p-2 bg-slate-100 rounded-lg border border-slate-200 text-[11px] text-slate-700 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>This AI is strictly configured for <strong>Microcells Diagnostics</strong> pathology catalog inquiries.</span>
                      </div>
                    )}

                    {/* Dynamic Action Chips for Recommended Tests / Packages */}
                    {msg.suggestedTests && msg.suggestedTests.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-2">
                        <p className="text-[10px] font-bold text-teal-800 uppercase tracking-wider flex items-center gap-1">
                          <Activity className="w-3 h-3 text-teal-600" />
                          Recommended in Microcells Catalog:
                        </p>
                        <div className="grid grid-cols-1 gap-1.5">
                          {msg.suggestedTests.map((item) => (
                            <div
                              key={item.id}
                              className="p-2 bg-slate-50 hover:bg-teal-50/80 rounded-xl border border-slate-200 hover:border-teal-300 transition-colors flex items-center justify-between gap-2"
                            >
                              <div className="min-w-0">
                                <p className="font-bold text-[11px] text-slate-800 truncate">
                                  {item.name}
                                </p>
                                <p className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5">
                                  <span className="font-bold text-teal-700">₹{item.price}</span>
                                  {item.sampleType && <span>• {item.sampleType}</span>}
                                  {item.fastingRequired && <span className="text-amber-700 font-medium">• Fasting Required</span>}
                                </p>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleActionAddToCart(item)}
                                  className="p-1.5 bg-white hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-200 text-[10px] font-medium transition-colors"
                                  title="Add to Cart"
                                >
                                  <ShoppingBag className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleActionBook(item)}
                                  className="px-2 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-[10px] font-bold transition-colors flex items-center gap-1"
                                >
                                  <Calendar className="w-3 h-3" />
                                  Book
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <span className="text-[9px] text-slate-400 mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}

            {/* Loading typing indicator */}
            {isLoading && (
              <div className="flex items-center gap-2 bg-white text-slate-500 border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-none w-fit text-xs animate-pulse shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-teal-500 animate-spin" />
                <span>Consulting Microcells Clinical Knowledge Base...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Form */}
          <div className="p-3 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-end gap-2"
            >
              <div className="relative flex-1">
                <textarea
                  ref={inputRef}
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Ask about any test (e.g., CBC, Fasting sugar, Thyroid)..."
                  rows={2}
                  className="w-full px-3 py-2 pr-9 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white resize-none"
                />

                {/* Voice Input Mic Button */}
                <button
                  type="button"
                  onClick={handleToggleListening}
                  className={`absolute right-2.5 bottom-2.5 p-1 rounded-lg transition-colors ${
                    isListening
                      ? 'bg-rose-500 text-white animate-ping'
                      : 'text-slate-400 hover:text-teal-600 hover:bg-slate-200/60'
                  }`}
                  title={isListening ? "Listening... click to stop" : "Speak your query"}
                >
                  {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                </button>
              </div>

              <button
                type="submit"
                disabled={!inputQuery.trim() || isLoading}
                className="p-3 bg-gradient-to-r from-teal-600 to-sky-700 hover:from-teal-500 hover:to-sky-600 disabled:opacity-50 text-white rounded-2xl shadow-md transition-all flex items-center justify-center cursor-pointer shrink-0"
                title="Send query"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 px-1">
              <span>NABL Accredited Diagnostics</span>
              <span>Online reports in 6-24 hrs</span>
            </div>
          </div>

        </div>
      )}
    </>
  );
};
