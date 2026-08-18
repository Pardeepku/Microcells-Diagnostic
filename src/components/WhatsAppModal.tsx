import React, { useState } from 'react';
import { 
  X, 
  MessageSquare, 
  Send, 
  Sparkles, 
  Calendar, 
  Home, 
  FileText, 
  HelpCircle,
  Phone
} from 'lucide-react';
import { LAB_INFO } from '../data/labData';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  isOpen,
  onClose
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState('home-collection');
  const [customMsg, setCustomMsg] = useState('');

  if (!isOpen) return null;

  const templates = [
    {
      id: 'home-collection',
      label: 'Book Home Sample Collection',
      icon: Home,
      text: `Hello Microcells Diagnostics, I would like to schedule a home sample collection for blood tests. Please share the available time slots.`
    },
    {
      id: 'package-inquiry',
      label: 'Health Checkup Package Inquiry',
      icon: Sparkles,
      text: `Hello Microcells Diagnostics, I am interested in booking a Comprehensive Health Checkup Package. Please guide me on fasting and parameters included.`
    },
    {
      id: 'report-status',
      label: 'Check My Report Status',
      icon: FileText,
      text: `Hello Microcells Diagnostics, I would like to check the status of my test report. My Patient Mobile / UHID is: `
    },
    {
      id: 'prescription-send',
      label: 'Send Doctor Prescription',
      icon: MessageSquare,
      text: `Hello Microcells Diagnostics, I am sharing my doctor's prescription for test pricing and booking.`
    }
  ];

  const handleSend = () => {
    const currentTpl = templates.find(t => t.id === selectedTemplate);
    const messageToSend = customMsg.trim() || currentTpl?.text || 'Hello Microcells Diagnostics, I have a query.';
    const encoded = encodeURIComponent(messageToSend);
    const cleanNumber = LAB_INFO.whatsappNumber.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanNumber}?text=${encoded}`;
    window.open(url, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200 relative my-6">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-emerald-200">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Connect on WhatsApp</h3>
              <p className="text-xs text-emerald-100">{LAB_INFO.whatsappDisplay} (Fast Response)</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-emerald-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs text-slate-700">
          <p className="text-slate-600">
            Select a quick topic or type your custom message to chat directly with our diagnostic customer desk:
          </p>

          {/* Quick options */}
          <div className="space-y-2">
            {templates.map(tpl => {
              const Icon = tpl.icon;
              const isSelected = selectedTemplate === tpl.id;
              return (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => {
                    setSelectedTemplate(tpl.id);
                    setCustomMsg(tpl.text);
                  }}
                  className={`w-full p-3 rounded-xl border flex items-center gap-3 text-left transition-all ${
                    isSelected 
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold ring-1 ring-emerald-500' 
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs">{tpl.label}</span>
                </button>
              );
            })}
          </div>

          {/* Custom Message Field */}
          <div>
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
              Preview Message:
            </label>
            <textarea
              rows={3}
              value={customMsg || templates.find(t => t.id === selectedTemplate)?.text}
              onChange={(e) => setCustomMsg(e.target.value)}
              className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            onClick={handleSend}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-900/20 transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Open WhatsApp Chat</span>
          </button>
        </div>

      </div>
    </div>
  );
};
