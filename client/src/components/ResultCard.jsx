import React from 'react';
import { Lightbulb, Globe2, MessageSquare } from 'lucide-react';

const ResultCard = ({ result, culture }) => {
  if (!result) return null;

  return (
    <div className="glass-card rounded-2xl p-6 md:p-8 space-y-6 mt-6 animate-[fadeIn_0.5s_ease-out]">
      <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
        <span className="text-2xl">
          {culture === 'USA' && '🇺🇸'}
          {culture === 'Japan' && '🇯🇵'}
          {culture === 'India' && '🇮🇳'}
          {culture === 'Germany' && '🇩🇪'}
        </span>
        <h3 className="font-semibold text-lg text-slate-800">
          Rewritten for {culture}
        </h3>
      </div>

      <div className="space-y-4">
        {/* Rewritten Message */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 relative group">
          <div className="absolute -top-3 -left-3 bg-indigo-100 text-indigo-600 p-2 rounded-lg shadow-sm">
            <MessageSquare size={16} />
          </div>
          <p className="text-slate-800 text-lg leading-relaxed ml-2 pt-2">
            {result.rewritten}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Explanation */}
          <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-100/50">
            <div className="flex items-center gap-2 text-amber-700 font-medium mb-2">
              <Lightbulb size={18} />
              <h4>Why is it different?</h4>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              {result.explanation}
            </p>
          </div>

          {/* Etiquette Tip */}
          <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-100/50">
            <div className="flex items-center gap-2 text-emerald-700 font-medium mb-2">
              <Globe2 size={18} />
              <h4>Etiquette Tip</h4>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              {result.tip}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
