/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Loader2, Copy, Check } from 'lucide-react';

export default function App() {
  const [csvData, setCsvData] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csvData }),
      });
      const data = await response.json();
      setAnalysis(data.analysis || data.error || '無法獲取分析結果。');
    } catch (error) {
      console.error(error);
      setAnalysis('分析時發生錯誤，請稍後再試。');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(analysis);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="space-y-2 text-center">
            <h1 className="text-3xl font-bold text-gray-900">AI 數據分析工具</h1>
            <p className="text-gray-600">貼上您的 CSV 資料，獲取 AI 洞察報告</p>
        </header>

        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <textarea
                value={csvData}
                onChange={(e) => setCsvData(e.target.value)}
                placeholder="在此貼上您的 CSV 資料..."
                className="w-full h-64 p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
            />
            <button
                onClick={handleAnalyze}
                disabled={loading || !csvData.trim()}
                className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? (
                    <>
                        <Loader2 className="animate-spin" size={20} />
                        分析中...
                    </>
                ) : (
                    '開始 AI 分析'
                )}
            </button>
        </section>

        {analysis && (
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">分析結果</h2>
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                    >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                        {copied ? '已複製' : '一鍵複製'}
                    </button>
                </div>
                <div className="prose prose-blue max-w-none text-gray-800">
                    <ReactMarkdown>{analysis}</ReactMarkdown>
                </div>
            </section>
        )}
      </div>
    </div>
  );
}

