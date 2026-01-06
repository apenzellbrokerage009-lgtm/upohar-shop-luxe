
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { AppState, ChatSession, ChatMessage, User } from '../../types';
import { 
  Search, MessageSquare, UserPlus, Clock, Send, 
  User as UserIcon, CheckCircle, Ban, ArrowLeft, 
  MoreHorizontal, Smile, Paperclip, Headset
} from 'lucide-react';

interface LiveSupportProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const LiveSupportModule: React.FC<LiveSupportProps> = ({ state, setState }) => {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeSession = useMemo(() => 
    state.chatSessions.find(s => s.id === activeSessionId), 
  [state.chatSessions, activeSessionId]);

  const staffList = useMemo(() => 
    state.adminUsers.filter(u => u.role !== 'customer'), 
  [state.adminUsers]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeSession?.messages, activeSessionId]);

  const handleSend = () => {
    if (!message.trim() || !activeSession) return;

    const newMessage: ChatMessage = {
      id: 'staff-' + Date.now(),
      sessionId: activeSession.id,
      senderId: state.currentUser?.id || 'admin',
      senderName: state.currentUser?.name || 'Administrator',
      senderRole: 'staff',
      text: message,
      timestamp: new Date().toISOString(),
      isRead: true
    };

    setState(prev => ({
      ...prev,
      chatSessions: prev.chatSessions.map(s => 
        s.id === activeSession.id 
          ? { ...s, messages: [...s.messages, newMessage], lastMessage: message, updatedAt: new Date().toISOString() } 
          : s
      )
    }));
    setMessage('');
  };

  const assignStaff = (sessionId: string, staffId: string) => {
    setState(prev => ({
      ...prev,
      chatSessions: prev.chatSessions.map(s => 
        s.id === sessionId ? { ...s, assignedStaffId: staffId } : s
      )
    }));
  };

  const closeSession = (sessionId: string) => {
    setState(prev => ({
      ...prev,
      chatSessions: prev.chatSessions.map(s => 
        s.id === sessionId ? { ...s, status: 'closed' } : s
      )
    }));
  };

  return (
    <div className="h-[calc(100vh-180px)] flex gap-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
      
      {/* Session List */}
      <div className="w-96 flex flex-col gap-6">
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 flex items-center gap-4 shadow-sm">
           <Search className="w-4 h-4 text-slate-300" />
           <input placeholder="Search active threads..." className="bg-transparent outline-none font-bold text-xs uppercase tracking-widest flex-grow" />
        </div>

        <div className="flex-grow bg-white rounded-[3.5rem] border border-slate-100 overflow-hidden flex flex-col shadow-sm">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center">
             <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Thread Matrix</h4>
             <span className="px-3 py-1 bg-rose-50 text-rose-600 text-[8px] font-black uppercase rounded-full">{state.chatSessions.filter(s => s.status === 'open').length} Active</span>
          </div>
          <div className="flex-grow overflow-y-auto scrollbar-hide divide-y divide-slate-50">
            {state.chatSessions.filter(s => s.status === 'open').sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).map(s => (
              <button 
                key={s.id} 
                onClick={() => setActiveSessionId(s.id)}
                className={`w-full p-8 text-left transition-all hover:bg-slate-50 group flex gap-4 ${activeSessionId === s.id ? 'bg-rose-50/50 border-r-4 border-rose-600' : ''}`}
              >
                <div className="relative shrink-0">
                   <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-xs uppercase italic">{s.customerName.charAt(0)}</div>
                   {s.messages.some(m => m.senderRole === 'customer' && !m.isRead) && (
                     <div className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 rounded-full border-2 border-white"></div>
                   )}
                </div>
                <div className="min-w-0 flex-grow">
                   <div className="flex justify-between items-start mb-1">
                      <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight truncate">{s.customerName}</p>
                      <p className="text-[8px] font-black text-slate-300 shrink-0">{new Date(s.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                   </div>
                   <p className="text-[10px] font-bold text-slate-400 truncate line-clamp-1">{s.lastMessage || 'Starting conversation...'}</p>
                   {s.assignedStaffId && (
                     <div className="mt-3 flex items-center gap-1.5">
                        <Headset className="w-3 h-3 text-emerald-600" />
                        <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">{staffList.find(staff => staff.id === s.assignedStaffId)?.name}</span>
                     </div>
                   )}
                </div>
              </button>
            ))}
            {state.chatSessions.length === 0 && (
              <div className="py-20 text-center px-10">
                 <MessageSquare className="w-12 h-12 text-slate-100 mx-auto mb-4" />
                 <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Awaiting active customer protocols</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Message Area */}
      <div className="flex-grow flex flex-col bg-white rounded-[4.5rem] border border-slate-100 shadow-2xl overflow-hidden relative">
        {activeSession ? (
          <>
            {/* Header */}
            <div className="px-12 py-8 bg-white border-b border-slate-50 flex justify-between items-center z-10">
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-slate-100 rounded-3xl flex items-center justify-center font-black text-slate-400">
                    <UserIcon className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase text-slate-900 tracking-tight">{activeSession.customerName}</h3>
                    <div className="flex items-center gap-3 mt-1">
                       <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">Session: {activeSession.id}</span>
                       <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                       <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.3em]">Identity Verified</span>
                    </div>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <div className="relative group">
                    <button className="px-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-[9px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-slate-100 transition-all">
                       <UserPlus className="w-4 h-4 text-rose-600" />
                       {activeSession.assignedStaffId ? staffList.find(s => s.id === activeSession.assignedStaffId)?.name : 'Delegate Agent'}
                    </button>
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-slate-100 rounded-3xl shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all p-2 z-[100]">
                       {staffList.map(staff => (
                         <button key={staff.id} onClick={() => assignStaff(activeSession.id, staff.id)} className="w-full text-left p-4 rounded-2xl hover:bg-slate-50 text-[10px] font-black uppercase tracking-widest flex justify-between items-center">
                            {staff.name}
                            {activeSession.assignedStaffId === staff.id && <CheckCircle className="w-3 h-3 text-emerald-600" />}
                         </button>
                       ))}
                    </div>
                  </div>
                  <button onClick={() => closeSession(activeSession.id)} className="p-3 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-2xl transition-all shadow-sm">
                    <Ban className="w-5 h-5" />
                  </button>
               </div>
            </div>

            {/* Conversation Log */}
            <div ref={scrollRef} className="flex-grow overflow-y-auto p-12 space-y-6 scrollbar-hide bg-slate-50/30">
               {activeSession.messages.map((m) => (
                 <div key={m.id} className={`flex ${m.senderRole === 'staff' ? 'justify-end' : 'justify-start'}`}>
                   <div className="max-w-[60%] flex flex-col gap-2">
                     <div className={`p-6 rounded-[2.5rem] shadow-sm text-sm font-medium leading-relaxed ${
                       m.senderRole === 'staff' 
                        ? 'bg-slate-900 text-white rounded-tr-none' 
                        : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                     }`}>
                       {m.text}
                     </div>
                     <p className={`text-[8px] font-black uppercase tracking-widest text-slate-300 ${m.senderRole === 'staff' ? 'text-right mr-4' : 'text-left ml-4'}`}>
                        {m.senderName} • {new Date(m.timestamp).toLocaleTimeString()}
                     </p>
                   </div>
                 </div>
               ))}
            </div>

            {/* Input Console */}
            <div className="p-10 bg-white border-t border-slate-50 shrink-0">
               <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-[2.5rem] border border-slate-100 focus-within:ring-8 focus-within:ring-rose-500/5 focus-within:border-rose-300 transition-all">
                  <div className="flex gap-2 pl-4">
                    <button className="p-2 text-slate-300 hover:text-rose-600 transition-colors"><Smile className="w-5 h-5"/></button>
                    <button className="p-2 text-slate-300 hover:text-rose-600 transition-colors"><Paperclip className="w-5 h-5"/></button>
                  </div>
                  <input 
                    placeholder="Enter support protocol response..." 
                    className="flex-grow bg-transparent outline-none font-bold text-sm py-4"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                  />
                  <button 
                    onClick={handleSend}
                    disabled={!message.trim()}
                    className="w-16 h-16 bg-rose-600 text-white rounded-[1.8rem] flex items-center justify-center hover:bg-rose-700 transition-all shadow-xl disabled:opacity-30 active:scale-90"
                  >
                    <Send className="w-6 h-6" />
                  </button>
               </div>
            </div>
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-center p-20 opacity-20">
             <div className="w-32 h-32 bg-slate-950 rounded-[3rem] flex items-center justify-center mb-10 shadow-2xl">
                <MessageSquare className="w-16 h-16 text-white" />
             </div>
             <h3 className="text-4xl font-black uppercase tracking-tighter text-slate-900 mb-4">Support Terminal Ready</h3>
             <p className="text-[11px] font-black uppercase tracking-[0.5em] max-w-sm leading-relaxed">Select a session from the thread matrix to begin communication</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveSupportModule;
