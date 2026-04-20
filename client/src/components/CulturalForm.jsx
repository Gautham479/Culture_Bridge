import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

const CulturalForm = ({ onSubmit, isLoading }) => {
  const [message, setMessage] = useState('');
  const [culture, setCulture] = useState('Japan');
  const [tone, setTone] = useState('Professional');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSubmit({ message, culture, tone });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 md:p-8 space-y-6">
      <div className="space-y-2">
        <label htmlFor="message" className="block font-medium text-slate-700">
          Your Message
        </label>
        <textarea
          id="message"
          rows="4"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type the message you want to adapt..."
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all resize-none bg-white font-medium"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="culture" className="block font-medium text-slate-700">
            Target Culture
          </label>
          <div className="relative">
            <select
              id="culture"
              value={culture}
              onChange={(e) => setCulture(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white appearance-none cursor-pointer"
            >
              <option value="USA">🇺🇸 USA</option>
              <option value="Japan">🇯🇵 Japan</option>
              <option value="India">🇮🇳 India</option>
              <option value="Germany">🇩🇪 Germany</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="tone" className="block font-medium text-slate-700">
            Desired Tone
          </label>
          <div className="relative">
            <select
              id="tone"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white appearance-none cursor-pointer"
            >
              <option value="Professional">Professional</option>
              <option value="Formal">Formal</option>
              <option value="Casual">Casual</option>
              <option value="Friendly">Friendly</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || !message.trim()}
        className="w-full flex items-center justify-center gap-2 primary-gradient text-white font-semibold py-3.5 px-6 rounded-xl hover:opacity-90 transition-opacity focus:ring-4 focus:ring-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed group shadow-md shadow-indigo-200"
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            Adapting Message...
          </>
        ) : (
          <>
            <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            Rewrite Message
          </>
        )}
      </button>
    </form>
  );
};

export default CulturalForm;
