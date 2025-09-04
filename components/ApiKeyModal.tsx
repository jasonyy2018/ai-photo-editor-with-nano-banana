
import React, { useState, useEffect } from 'react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (googleKey: string, openRouterKey: string) => void;
  currentGoogleApiKey: string;
  currentOpenRouterApiKey: string;
}

const KeyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 7h2a2 2 0 012 2v6a2 2 0 01-2 2h-2m-6 0H7a2 2 0 01-2-2V9a2 2 0 012-2h2m-6 0V7a2 2 0 012-2h2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v2m-6 0h6" />
    </svg>
);

export default function ApiKeyModal({ isOpen, onClose, onSave, currentGoogleApiKey, currentOpenRouterApiKey }: ApiKeyModalProps) {
  const [googleKey, setGoogleKey] = useState('');
  const [openRouterKey, setOpenRouterKey] = useState('');

  useEffect(() => {
    if (isOpen) {
      setGoogleKey(currentGoogleApiKey);
      setOpenRouterKey(currentOpenRouterApiKey);
    }
  }, [isOpen, currentGoogleApiKey, currentOpenRouterApiKey]);

  if (!isOpen) {
    return null;
  }
  
  const handleSave = () => {
    onSave(googleKey, openRouterKey);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
        onClose();
    }
  };

  return (
    <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" 
        aria-labelledby="modal-title" 
        role="dialog" 
        aria-modal="true"
        onClick={handleBackdropClick}
    >
      <div className="bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md border border-slate-700 animate-fade-in-up">
        <div className="flex items-center justify-between mb-4">
            <h2 id="modal-title" className="text-xl font-bold text-white flex items-center"><KeyIcon /> API Key Settings</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl leading-none">&times;</button>
        </div>
        
        <p className="text-sm text-slate-400 mb-6">Your API keys are stored in your browser's local storage and are never sent to our servers.</p>

        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <div className="space-y-4">
            <div>
              <label htmlFor="google-key" className="block text-sm font-medium text-slate-300 mb-1">Google Gemini API Key</label>
              <input
                type="password"
                id="google-key"
                value={googleKey}
                onChange={(e) => setGoogleKey(e.target.value)}
                placeholder="Enter your Gemini API Key for editing"
                className="block w-full rounded-md border-0 bg-slate-700/80 p-3 text-gray-200 shadow-sm ring-1 ring-inset ring-slate-600 focus:ring-2 focus:ring-inset focus:ring-sky-500"
              />
            </div>
            <div>
              <label htmlFor="openrouter-key" className="block text-sm font-medium text-slate-300 mb-1">OpenRouter API Key</label>
              <input
                type="password"
                id="openrouter-key"
                value={openRouterKey}
                onChange={(e) => setOpenRouterKey(e.target.value)}
                placeholder="Enter your OpenRouter key for descriptions"
                className="block w-full rounded-md border-0 bg-slate-700/80 p-3 text-gray-200 shadow-sm ring-1 ring-inset ring-slate-600 focus:ring-2 focus:ring-inset focus:ring-sky-500"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700 rounded-md hover:bg-slate-600 transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-md hover:bg-sky-500 transition-colors">Save Keys</button>
          </div>
        </form>
      </div>
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
