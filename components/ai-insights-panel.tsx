'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { WeatherRecord } from '@/lib/weather-data';
import { Sparkles, RefreshCw, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface AIInsightsPanelProps {
  data: WeatherRecord[];
  filters: {
    season: string;
    location: string;
    weatherType: string;
  };
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIInsightsPanel({ data, filters }: AIInsightsPanelProps) {
  const [insights, setInsights] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const generateInsights = async () => {
    if (data.length === 0) {
      setError('No data available to analyze. Please adjust your filters.');
      return;
    }

    setLoading(true);
    setError(null);
    setInsights('');

    try {
      const response = await fetch('/api/ai-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: data.slice(0, 500), // Limit data sent to API
          filters,
          conversationHistory: conversationHistory.slice(-4), // Keep last 4 messages for context
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate insights');
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          fullContent += chunk;
          setInsights(fullContent);
        }
      }

      // Add to conversation history
      if (fullContent) {
        setConversationHistory(prev => [
          ...prev,
          { role: 'user', content: 'Generate weather insights for current data' },
          { role: 'assistant', content: fullContent },
        ]);
      }
    } catch (err) {
      console.error('[AIInsights] Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate insights');
    } finally {
      setLoading(false);
    }
  };

  const clearConversation = () => {
    setConversationHistory([]);
    setInsights('');
    setError(null);
  };

  // Auto-scroll when new content arrives
  useEffect(() => {
    if (contentRef.current && loading) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [insights, loading]);

  return (
    <Card className="bg-white dark:bg-slate-800 border-purple-200 dark:border-purple-700/50 shadow-md hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20">
              <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                AI Weather Insights
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Chain-of-thought analysis powered by Gemini
              </CardDescription>
            </div>
          </div>
          <div className="flex gap-2">
            {conversationHistory.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
                className="text-slate-600 dark:text-slate-300"
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                {showHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            )}
            {conversationHistory.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearConversation}
                className="text-slate-600 dark:text-slate-300"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            )}
            <Button
              onClick={generateInsights}
              disabled={loading || data.length === 0}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold"
            >
              {loading ? (
                <>
                  <Spinner className="w-4 h-4 mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Insights
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Conversation History */}
        {showHistory && conversationHistory.length > 0 && (
          <div className="mb-4 p-3 bg-slate-100 dark:bg-slate-900/50 rounded-lg max-h-40 overflow-y-auto">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
              Conversation History ({conversationHistory.length} messages)
            </p>
            {conversationHistory.slice(-4).map((msg, idx) => (
              <div
                key={idx}
                className={`text-xs mb-1 ${
                  msg.role === 'user' 
                    ? 'text-purple-600 dark:text-purple-400' 
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                <span className="font-semibold">{msg.role === 'user' ? 'You: ' : 'AI: '}</span>
                {msg.content.slice(0, 100)}...
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        {/* Initial State */}
        {!insights && !loading && !error && (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-purple-500" />
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-2">
              Click &quot;Generate Insights&quot; to analyze your weather data
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500">
              {data.length} records will be analyzed using chain-of-thought reasoning
            </p>
          </div>
        )}

        {/* Insights Content */}
        {(insights || loading) && (
          <div
            ref={contentRef}
            className="prose prose-sm dark:prose-invert max-w-none max-h-96 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg"
          >
            <div className="whitespace-pre-wrap text-slate-700 dark:text-slate-300 leading-relaxed">
              {insights}
              {loading && <span className="inline-block w-2 h-4 bg-purple-500 animate-pulse ml-1" />}
            </div>
          </div>
        )}

        {/* Footer Info */}
        {insights && !loading && (
          <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Analyzed {Math.min(data.length, 500)} records</span>
            <span>
              Filters: {filters.season !== 'all' ? filters.season : 'All Seasons'} | {' '}
              {filters.location !== 'all' ? filters.location : 'All Locations'} | {' '}
              {filters.weatherType !== 'all' ? filters.weatherType : 'All Types'}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
