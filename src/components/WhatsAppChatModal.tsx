import React, { useState, useEffect } from 'react';
import { X, Send, CheckCheck, Sparkles, Tag, ShieldCheck } from 'lucide-react';
import { ChatMessage } from '../types';

interface WhatsAppChatModalProps {
  isOpen: boolean;
  sellerId: string;
  sellerName: string;
  initialOffer?: number;
  onClose: () => void;
}

export const WhatsAppChatModal: React.FC<WhatsAppChatModalProps> = ({
  isOpen,
  sellerId,
  sellerName,
  initialOffer,
  onClose,
}) => {
  if (!isOpen) return null;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState(initialOffer ? `Hi! I would like to offer ₹${initialOffer.toLocaleString('en-IN')} for this item.` : '');
  const [loading, setLoading] = useState(false);
  const roomId = 'room_1';

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/chats/messages/${roomId}`);
      const data = await res.json();
      if (data.success && data.messages) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error('Fetch messages error:', err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [roomId]);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/chats/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId,
          senderId: 'cust_101',
          senderName: 'Aarav (Buyer)',
          senderRole: 'customer',
          text: textToSend,
          offerPrice: initialOffer,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setInput('');
        fetchMessages();
      }
    } catch (err) {
      console.error('Send message error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md h-[80vh] bg-slate-900 text-white rounded-3xl shadow-2xl overflow-hidden border border-slate-800 flex flex-col justify-between">
        
        {/* WhatsApp Style Top Bar */}
        <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center font-black text-sm">
              {sellerName.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-1">
                {sellerName} <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 inline" />
              </h3>
              <p className="text-[10px] text-emerald-400">Online • NeedHub Verified Seller</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-700 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Reply Quick Suggestions */}
        <div className="p-2 bg-slate-950/60 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-bold text-indigo-400 uppercase shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Quick Prompts:
          </span>
          {[
            'Is express delivery available?',
            'Can I see additional photos?',
            'What is the warranty policy?',
          ].map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="px-2.5 py-1 rounded-full text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 shrink-0 transition"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
          {messages.map((msg) => {
            const isMe = msg.senderRole === 'customer';
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-xs space-y-1 shadow-sm ${
                    isMe
                      ? 'bg-emerald-700 text-white rounded-tr-none'
                      : 'bg-slate-800 text-slate-200 rounded-tl-none'
                  }`}
                >
                  <p className="font-bold text-[10px] opacity-75">{msg.senderName}</p>
                  <p className="leading-relaxed">{msg.text}</p>
                  {msg.offerPrice && (
                    <div className="mt-2 p-2 rounded-xl bg-black/20 border border-white/10 flex items-center justify-between text-[11px]">
                      <span className="font-bold flex items-center gap-1">
                        <Tag className="w-3 h-3 text-yellow-300" /> Offer: ₹{msg.offerPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="uppercase text-[9px] font-extrabold text-emerald-300">
                        {msg.offerStatus || 'pending'}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-end gap-1 text-[9px] opacity-60">
                    <span>{msg.timestamp}</span>
                    <CheckCheck className="w-3 h-3 text-emerald-300" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-slate-800 border-t border-slate-700 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message or price offer..."
            className="flex-1 px-4 py-2 text-xs bg-slate-900 border border-slate-700 rounded-full text-white focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="p-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
