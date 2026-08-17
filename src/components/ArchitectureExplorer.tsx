import React, { useState } from 'react';
import { ApiEndpointSpec } from '../types';
import { Cpu, Send, RefreshCw, Terminal, CheckCircle2, Server, Database, Shield, Layers } from 'lucide-react';

interface ArchitectureExplorerProps {
  apiSpecs: ApiEndpointSpec[];
}

export const ArchitectureExplorer: React.FC<ArchitectureExplorerProps> = ({ apiSpecs }) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpointSpec>(apiSpecs[0]);
  const [requestBodyInput, setRequestBodyInput] = useState<string>(
    JSON.stringify(apiSpecs[0].sampleRequest || {}, null, 2)
  );
  const [liveResponse, setLiveResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectEndpoint = (spec: ApiEndpointSpec) => {
    setSelectedEndpoint(spec);
    setRequestBodyInput(JSON.stringify(spec.sampleRequest || {}, null, 2));
    setLiveResponse(null);
  };

  const handleExecuteApi = async () => {
    setIsLoading(true);
    setLiveResponse(null);

    try {
      let bodyData;
      if (selectedEndpoint.method === 'POST' || selectedEndpoint.method === 'PUT') {
        try {
          bodyData = JSON.parse(requestBodyInput);
        } catch {
          bodyData = selectedEndpoint.sampleRequest;
        }
      }

      const res = await fetch(selectedEndpoint.path, {
        method: selectedEndpoint.method,
        headers: { 'Content-Type': 'application/json' },
        body: bodyData ? JSON.stringify(bodyData) : undefined,
      });

      const data = await res.json();
      setLiveResponse(data);
    } catch (err: any) {
      setLiveResponse({ error: 'Failed to complete API call', details: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const microservices = [
    { name: 'API Gateway & Nginx', desc: 'Port 3000 reverse proxy routing REST & Socket requests' },
    { name: 'Auth & User Service', desc: 'Firebase Auth, JWT sessions & Role Based Access Control' },
    { name: 'Product & Catalog Service', desc: 'Multi-type listings (Physical, Digital, Services, OLX Refurbished)' },
    { name: 'Seller & Business Hub', desc: 'Inventory, AI description generator & Sales analytics' },
    { name: 'Order & Escrow Payment', desc: 'Multi-gateway (Razorpay, Stripe, UPI) with OTP verification' },
    { name: 'AI Intelligence Service', desc: 'Server-side Gemini 3.6 Flash for Assistant, Coach & Fraud Detection' },
    { name: 'Realtime Chat & Social', desc: 'Direct WhatsApp-style buyer-seller chat & Instagram stories' },
    { name: 'Hyperlocal Delivery Service', desc: 'Rider dispatch, distance matrix & OTP delivery completion' },
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-purple-500/20 text-xs font-bold uppercase tracking-wider text-purple-300 border border-purple-500/30">
            System Architecture & Live API Documentation
          </span>
          <h2 className="text-2xl font-black mt-1">NeedHub Enterprise Microservices Blueprint</h2>
          <p className="text-xs text-purple-200">Express Node.js Backend • Server-Side Gemini AI • Multi-Role State Engine</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Express Server Active
          </span>
        </div>
      </div>

      {/* Microservices Blueprint Grid */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xs">
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-purple-600" /> NeedHub Microservices Topography
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {microservices.map((ms, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1"
            >
              <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block">
                Module #{idx + 1}
              </span>
              <h4 className="font-bold text-xs text-slate-900 dark:text-white">{ms.name}</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{ms.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive REST / Swagger Tester */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Endpoint Selector */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xs">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Terminal className="w-4 h-4 text-indigo-500" /> Interactive REST API Tester
          </h3>

          <div className="space-y-2">
            {apiSpecs.map((spec, idx) => (
              <div
                key={idx}
                onClick={() => handleSelectEndpoint(spec)}
                className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-2 ${
                  selectedEndpoint.path === spec.path && selectedEndpoint.method === spec.method
                    ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-black rounded-md text-white shrink-0 ${
                      spec.method === 'GET' ? 'bg-emerald-600' : 'bg-indigo-600'
                    }`}
                  >
                    {spec.method}
                  </span>
                  <span className="font-mono text-xs font-bold truncate">{spec.path}</span>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0">{spec.module}</span>
              </div>
            ))}
          </div>

          {/* Request Payload Editor for POST */}
          {(selectedEndpoint.method === 'POST' || selectedEndpoint.method === 'PUT') && (
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Request Body (JSON):</label>
              <textarea
                rows={4}
                value={requestBodyInput}
                onChange={(e) => setRequestBodyInput(e.target.value)}
                className="w-full p-3 font-mono text-xs bg-slate-900 text-emerald-400 rounded-2xl focus:outline-none"
              />
            </div>
          )}

          <button
            onClick={handleExecuteApi}
            disabled={isLoading}
            className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Execute Live Express Request
          </button>
        </div>

        {/* Live Response Panel */}
        <div className="p-6 rounded-3xl bg-slate-950 text-slate-100 border border-slate-800 space-y-3 font-mono text-xs shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <Server className="w-4 h-4" /> Live Backend Output Response
            </span>
            <span className="text-[10px] text-slate-500">HTTP/1.1 200 OK</span>
          </div>

          <div className="flex-1 overflow-y-auto max-h-96 p-3 bg-slate-900 rounded-2xl border border-slate-800/80 text-emerald-300 whitespace-pre-wrap">
            {isLoading ? (
              <span className="text-amber-400 animate-pulse">Communicating with Express backend microservice...</span>
            ) : liveResponse ? (
              JSON.stringify(liveResponse, null, 2)
            ) : (
              <span className="text-slate-500">Click "Execute Live Express Request" to inspect actual server JSON output.</span>
            )}
          </div>

          <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-800 flex justify-between">
            <span>Server: Express / Node.js</span>
            <span>Gemini API: Server-Side Proxied</span>
          </div>
        </div>

      </div>

    </div>
  );
};
