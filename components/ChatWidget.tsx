
import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User, Headset, Smile } from 'lucide-react';
import { AppState, ChatMessage, ChatSession, User as UserType } from '../types';

interface ChatWidgetProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ state, setState }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [session, setSession] = useState<ChatSession | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize or resume session
  useEffect(() => {
    const savedId = localStorage.getItem('upohar_luxe_chat_id');
    const existing = state.chatSessions.find(s => s.id === savedId);
    
    if (existing) {
      setSession(existing);
    } else {
      const newId = 'S-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      const guestName = state.currentUser?.name || 'Guest User';
      const newSession: ChatSession = {
        id: newId,
        customerId: state.currentUser?.id || 'guest-' + Date.now(),
        customerName: guestName,
        updatedAt: new Date().toISOString(),
        status: 'open',
        messages: [{
          id: 'welcome',
          sessionId: newId,
          senderId: 'system',
          senderName: 'Luxe Concierge',
          senderRole: 'staff',
          text: `Greetings ${guestName}, how may our concierge assist you today?`,
          timestamp: new Date().toISOString(),
          isRead: true
        }]
      };
      
      setState(prev => ({ ...prev, chatSessions: [...prev.chatSessions, newSession] }));
      localStorage.setItem('upohar_luxe_chat_id', newId);
      setSession(newSession);
    }
  }, [state.currentUser?.id]);

  // Sync session with global state
  useEffect(() => {
    if (session) {
      const updated = state.chatSessions.find(s => s.id === session.id);
      if (updated) setSession(updated);
    }
  }, [state.chatSessions]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [session?.messages, isOpen]);

  const handleSend = () => {
    if (!message.trim() || !session) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sessionId: session.id,
      senderId: session.customerId,
      senderName: session.customerName,
      senderRole: 'customer',
      text: message,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    setState(prev => ({
      ...prev,
      chatSessions: prev.chatSessions.map(s => 
        s.id === session.id 
          ? { ...s, messages: [...s.messages, newMessage], lastMessage: message, updatedAt: new Date().toISOString() } 
          : s
      )
    }));
    setMessage('');
  };

  const unreadCount = session?.messages.filter(m => m.senderRole === 'staff' && !m.isRead).length || 0;

  return (
    <div className="fixed bottom-6 right-6 z-[300] flex flex-col items-end gap-4 no-print">
      {isOpen && (
        <div className="w-[380px] h-[550px] bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-slate-900 p-6 flex justify-between items-center text-white shrink-0">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-rose-600 rounded-2xl flex items-center justify-center text-white font-black italic shadow-lg">U</div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full"></div>
              </div>
              <div>
                <h4 className="font-black uppercase text-[10px] tracking-widest text-slate-400">Live Concierge</h4>
                <p className="text-sm font-bold tracking-tight">Upohar Luxe Assistant</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-4 scrollbar-hide bg-slate-50/50">
            {session?.messages.map((m, i) => (
              <div key={m.id} className={`flex ${m.senderRole === 'customer' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-3xl text-sm leading-relaxed shadow-sm ${
                  m.senderRole === 'customer' 
                    ? 'bg-rose-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                }`}>
                  <p className="font-medium">{m.text}</p>
                  <p className={`text-[8px] mt-2 font-bold uppercase tracking-widest opacity-40 ${m.senderRole === 'customer' ? 'text-right' : 'text-left'}`}>
                    {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-5 bg-white border-t border-slate-100 shrink-0">
            <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-[1.8rem] border border-slate-100 focus-within:border-rose-300 focus-within:ring-4 focus-within:ring-rose-500/5 transition-all">
              <button className="p-2 text-slate-400 hover:text-rose-600"><Smile className="w-5 h-5" /></button>
              <input 
                placeholder="Compose message..." 
                className="flex-grow bg-transparent outline-none text-sm font-bold py-2"
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={handleSend}
                disabled={!message.trim()}
                className="w-10 h-10 bg-slate-900 text-white rounded-2xl flex items-center justify-center disabled:opacity-30 hover:bg-rose-600 transition-all shadow-lg shadow-slate-900/10 active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-slate-950 text-white rounded-[1.8rem] shadow-[0_10px_30px_rgba(0,0,0,0.2)] flex items-center justify-center transition-all hover:scale-110 active:scale-95 group relative border border-white/5"
      >
        {isOpen ? <X className="w-7 h-7" /> : <MessageCircle className="w-7 h-7 group-hover:rotate-12 transition-transform" />}
        {!isOpen && unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 w-7 h-7 bg-rose-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-4 border-slate-50 shadow-lg">
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
};

export default ChatWidget;
