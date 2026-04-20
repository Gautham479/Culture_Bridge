import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import ResultCard from './ResultCard';

const ComparisonView = ({ onCompare, comparisons, isComparing }) => {
  const [message, setMessage] = useState('');
  const [tone, setTone] = useState('Professional');

  const cultures = ['USA', 'Japan', 'India', 'Germany'];

  const handleCompare = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onCompare({ message, tone, cultures });
    }
  };

  return (
    <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
      <form onSubmit={handleCompare} className="glass-card rounded-2xl p-6 md:p-8 space-y-6">
        <div className="space-y-2">
          <label htmlFor="comp-message" className="block font-medium text-slate-700">
            Message to Compare
          </label>
          <textarea
            id="comp-message"
            rows="3"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type the message you want to compare across cultures..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all resize-none bg-white font-medium"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="comp-tone" className="block font-medium text-slate-700">
            Base Tone
          </label>
          <div className="relative">
            <select
              id="comp-tone"
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

        <button
          type="submit"
          disabled={isComparing || !message.trim()}
          className="w-full flex items-center justify-center gap-2 primary-gradient text-white font-semibold py-3.5 px-6 rounded-xl hover:opacity-90 transition-opacity focus:ring-4 focus:ring-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed group shadow-md shadow-indigo-200"
        >
          {isComparing ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Generating Comparisons...
            </>
          ) : (
            'Compare All Cultures'
          )}
        </button>
      </form>

      {/* Results Section */}
      {comparisons && Object.keys(comparisons).length > 0 && (
        <div className="grid lg:grid-cols-2 gap-6">
          {cultures.map((culture) => (
            <div key={culture} className="h-full">
              {comparisons[culture] ? (
                <ResultCard result={comparisons[culture]} culture={culture} />
              ) : (
                 isComparing && (
                    <div className="glass-card rounded-2xl p-6 md:p-8 h-full flex flex-col items-center justify-center min-h-[300px] mt-6 border border-slate-200 border-dashed">
                      <Loader2 className="animate-spin text-indigo-500 mb-4" size={32} />
                      <p className="text-slate-500 font-medium animate-pulse">Adapting for {culture}...</p>
                    </div>
                 )
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComparisonView;
