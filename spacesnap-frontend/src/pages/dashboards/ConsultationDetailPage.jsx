// src/pages/dashboards/ConsultationDetailPage.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';
import { Loader2, Send, ArrowLeft } from 'lucide-react';

const MessageBubble = ({ message, isCurrentUser }) => {
  const alignClass = isCurrentUser ? 'justify-end' : 'justify-start';
  const bubbleClass = isCurrentUser ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800';
  
  return (
    <div className={`flex items-end gap-3 ${alignClass}`}>
      {!isCurrentUser && (
        <img src={message.user.avatar} alt={message.user.name} className="w-8 h-8 rounded-full" />
      )}
      <div className={`max-w-md p-3 rounded-xl ${bubbleClass}`}>
        <p className="text-sm">{message.message}</p>
        <p className={`text-xs opacity-70 mt-1 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
          {new Date(message.createdAt).toLocaleTimeString()}
        </p>
      </div>
       {isCurrentUser && (
        <img src={message.user.avatar} alt={message.user.name} className="w-8 h-8 rounded-full" />
      )}
    </div>
  );
};


const ConsultationDetailPage = () => {
  const { consultationId } = useParams();
  const { user } = useAuth();
  const [consultation, setConsultation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reply, setReply] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchConsultation = async () => {
      try {
        const res = await api.get(`/consultations/${consultationId}`);
        setConsultation(res.data);
      } catch (err) {
        setError('Could not load consultation details.');
        console.error("Fetch consultation error:", err);
      } finally {
        setLoading(false);
      }
  };

  useEffect(() => {
    fetchConsultation();
  }, [consultationId]);

  useEffect(() => {
    scrollToBottom();
  }, [consultation?.replies]);

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return;

    setIsSending(true);
    try {
      const res = await api.post(`/consultations/${consultationId}/reply`, { message: reply });
      setConsultation(res.data); // Update with the full consultation object returned from backend
      setReply('');
    } catch (err) {
      alert('Failed to send reply.');
      console.error("Send reply error:", err);
    } finally {
      setIsSending(false);
    }
  };


  if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-blue-600" size={48} /></div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!consultation) return <div className="text-center">Consultation not found.</div>;

  const otherParty = user.email === consultation.user.email ? consultation.designer : consultation.user;

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow border">
      {/* Header */}
      <div className="p-4 border-b flex items-center gap-4">
        <Link to={user.role === 'designer' ? '/designer/dashboard' : '/user/consultations'} className="text-gray-500 hover:text-gray-800">
          <ArrowLeft size={20} />
        </Link>
        <img src={otherParty.avatar} alt={otherParty.name} className="w-10 h-10 rounded-full" />
        <div>
          <h2 className="font-bold text-lg">{otherParty.name}</h2>
          <p className="text-sm text-gray-500">{consultation.subject}</p>
        </div>
      </div>

      {/* Message Area */}
      <div className="flex-grow p-6 space-y-6 overflow-y-auto">
        {/* Initial Message */}
        <div className="text-center text-xs text-gray-400 pb-4 border-b">
          Conversation started on {new Date(consultation.createdAt).toLocaleDateString()}
        </div>
        <MessageBubble message={{ ...consultation, user: consultation.user, createdAt: consultation.createdAt }} isCurrentUser={user.email === consultation.user.email} />
        
        {/* Replies */}
        {consultation.replies.map((rep) => (
          <MessageBubble key={rep._id} message={rep} isCurrentUser={user.email === rep.user.email} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-4 border-t bg-gray-50">
        <form onSubmit={handleSendReply} className="flex items-center gap-3">
          <input
            type="text"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            className="flex-grow px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
            disabled={isSending}
          />
          <button type="submit" className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 disabled:bg-gray-400" disabled={isSending}>
            {isSending ? <Loader2 className="animate-spin" size={20}/> : <Send size={20}/>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConsultationDetailPage;