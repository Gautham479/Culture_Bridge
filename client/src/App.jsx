import React, { useState } from 'react';
import axios from 'axios';
import { Globe, Languages, Zap } from 'lucide-react';
import CulturalForm from './components/CulturalForm';
import ResultCard from './components/ResultCard';
import ComparisonView from './components/ComparisonView';

const API_URL = '/api/rewrite';

function App() {
  const [activeTab, setActiveTab] = useState('single'); // 'single' | 'compare'
  
  // Single mode state
  const [singleResult, setSingleResult] = useState(null);
  const [singleLoading, setSingleLoading] = useState(false);
  const [currentCulture, setCurrentCulture] = useState('');
  const [error, setError] = useState('');

  // Compare mode state
  const [comparisons, setComparisons] = useState({});
  const [isComparing, setIsComparing] = useState(false);

  const handleSingleSubmit = async (data) => {
    setSingleLoading(true);
    setError('');
    setCurrentCulture(data.culture);
    setSingleResult(null);

    try {
      const response = await axios.post(API_URL, data);
      setSingleResult(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to rewrite message. Ensure backend is running and API key is set.');
    } finally {
      setSingleLoading(false);
    }
  };

  const handleCompare = async (data) => {
    setIsComparing(true);
    setError('');
    setComparisons({});

    const { message, tone, cultures } = data;

    // Fire requests for all cultures simultaneously
    try {
      const promises = cultures.map(async (culture) => {
        try {
          const res = await axios.post(API_URL, { message, tone, culture });
          setComparisons(prev => ({ ...prev, [culture]: res.data }));
        } catch (err) {
          console.error(`Error fetching for ${culture}:`, err);
          setComparisons(prev => ({ ...prev, [culture]: { error: 'Failed to fetch' } }));
        }
      });

      await Promise.all(promises);
    } catch (err) {
      console.error('Error during comparison:', err);
      setError('An error occurred while comparing cultures.');
    } finally {
      setIsComparing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob pointer-events-none"></div>
      <div className="absolute top-0 -right-40 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 pointer-events-none"></div>
      <div className="absolute -bottom-40 left-20 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000 pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-4 py-12 relative z-10">
        
        {/* Header */}
        <header className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center justify-center p-3 glass-card rounded-2xl mb-4">
            <Globe className="text-indigo-600 w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Cross-Cultural <br className="hidden md:block" />
            <span className="text-gradient">Communication Assistant</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Bridge cultural gaps effortlessly. Tailor your messages to match international communication styles powered by Groq Llama-3.
          </p>
        </header>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/60 p-1.5 rounded-2xl flex backdrop-blur-md border border-slate-200 shadow-sm">
            <button
              onClick={() => setActiveTab('single')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === 'single'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Zap size={18} />
              Single Rewrite
            </button>
            <button
              onClick={() => setActiveTab('compare')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === 'compare'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Languages size={18} />
              Compare Cultures
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="max-w-3xl mx-auto w-full transition-all duration-300">
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl text-center animate-[fadeIn_0.3s]">
              {error}
            </div>
          )}

          {activeTab === 'single' ? (
            <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
              <CulturalForm onSubmit={handleSingleSubmit} isLoading={singleLoading} />
              <ResultCard result={singleResult} culture={currentCulture} />
            </div>
          ) : (
            <ComparisonView 
              onCompare={handleCompare} 
              comparisons={comparisons} 
              isComparing={isComparing} 
            />
          )}

        </div>
      </div>
    </div>
  );
}

export default App;
