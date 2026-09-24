import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Paperclip, 
  Mic, 
  Bot, 
  User, 
  ShieldCheck, 
  RotateCcw, 
  Info, 
  ArrowRight,
  Stethoscope
} from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

// ==========================================
// MOCK DATA (Hardcoded for teaching purposes)
// Later replace with: api.ai.sendChatMessage({ message, history })
// ==========================================

const MOCK_PROMPT_SUGGESTIONS = [
  'Explain my elevated fasting blood sugar (115 mg/dL)',
  'Can I take ibuprofen with amoxicillin?',
  'Safe home remedies for persistent dry cough',
  'When should I see an urgent care doctor for migraine?',
];

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: 'ai',
    text: "Hello Sarah! I am MediTrust's Clinical AI Assistant. I can help interpret laboratory numbers, explain prescription instructions, or evaluate mild symptoms to guide your care.",
    time: '10:14 AM',
    sources: ['UpToDate Clinical Consensus', 'Mayo Clinic Evidence Base'],
  },
  {
    id: 2,
    sender: 'user',
    text: 'My doctor prescribed Amoxicillin 500mg for bronchitis, but my stomach feels slightly unsettled. Should I keep taking it, and can I take probiotics?',
    time: '10:15 AM',
  },
  {
    id: 3,
    sender: 'ai',
    text: `Mild gastrointestinal discomfort is one of the most common and expected side effects of broad-spectrum antibiotics like Amoxicillin as it alters temporary gut flora.

Here is clinical guidance:
1. **Never stop early**: Discontinuing your antibiotic prematurely can lead to bacterial resistance and recurrence of your bronchitis.
2. **Take with meals**: Taking Amoxicillin alongside food or a light snack substantially mitigates stomach upset.
3. **Probiotics are helpful**: You can take probiotics, but space them at least 2 hours apart from your antibiotic dose so the Amoxicillin does not neutralize the active probiotic cultures.

⚠️ *Warning*: If you develop severe watery diarrhea, fever, or allergic hives, discontinue and consult Dr. Jenkins immediately.`,
    time: '10:15 AM',
    sources: ['FDA Antibiotic Monograph', 'American College of Gastroenterology'],
  },
];

export default function AiChatPage({ onNavigate }) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const userMsg = {
      id: messages.length + 1,
      sender: 'user',
      text: inputText,
      time: 'Just now',
    };
    setMessages([...messages, userMsg]);
    setInputText('');
  };

  const handleSelectPrompt = (prompt) => {
    setInputText(prompt);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-900">MediTrust AI Clinical Companion</h1>
              <Badge variant="purple" size="sm" dot>
                Clinical v4.2 Active
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Trained on peer-reviewed clinical guidelines • HIPAA secure session
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('doctors')}
            icon={Stethoscope}
          >
            Connect with Real Doctor
          </Button>
          <button
            onClick={() => setIsTyping(!isTyping)}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
            title="Toggle typing animation demo"
          >
            {isTyping ? 'Hide Typing Demo' : 'Show Typing Demo'}
          </button>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-xs font-semibold text-slate-400 shrink-0">Try asking:</span>
        {MOCK_PROMPT_SUGGESTIONS.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSelectPrompt(prompt)}
            className="px-3 py-1.5 rounded-xl border border-indigo-100 bg-indigo-50/60 hover:bg-indigo-100 text-indigo-800 text-xs font-medium whitespace-nowrap transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <Card className="p-4 sm:p-6 min-h-[480px] max-h-[600px] overflow-y-auto space-y-5 bg-slate-50/50">
        
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  isUser
                    ? 'bg-teal-600 text-white'
                    : 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-xs'
                }`}
              >
                {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-xl space-y-1.5 ${isUser ? 'items-end text-right' : 'items-start text-left'}`}>
                
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                    isUser
                      ? 'bg-teal-600 text-white rounded-tr-none'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none space-y-2'
                  }`}
                >
                  <div className="whitespace-pre-line">{msg.text}</div>

                  {/* AI Evidence Sources */}
                  {msg.sources && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
                      <span className="font-semibold text-slate-600">Verified Sources:</span>
                      {msg.sources.map((s, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="text-[10px] text-slate-400 px-1">
                  {msg.time}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing Indicator Animation */}
        {isTyping && (
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-3.5 shadow-xs flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              <span className="text-xs text-slate-400 font-medium ml-1.5">MediTrust AI is formulating medical guidance...</span>
            </div>
          </div>
        )}

      </Card>

      {/* Input Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2.5 shadow-sm flex items-center gap-2">
        <button
          type="button"
          onClick={() => onNavigate('ai-prescription')}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          title="Attach prescription or lab report"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask MediTrust AI about medicines, symptoms, or test results..."
          className="flex-1 bg-transparent border-0 text-sm text-slate-800 placeholder-slate-400 focus:outline-none px-2"
        />

        <button
          type="button"
          className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          title="Voice input"
        >
          <Mic className="w-5 h-5" />
        </button>

        <Button
          variant="ai"
          size="sm"
          onClick={handleSendMessage}
          icon={Send}
          className="shadow-xs"
        >
          Send
        </Button>
      </div>

    </div>
  );
}
