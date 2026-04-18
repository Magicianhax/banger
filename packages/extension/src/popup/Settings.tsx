import { useEffect, useState } from 'react';
import { PROVIDERS, MODEL_OPTIONS, type Provider } from '@banger/shared';
import { getSettings, saveSettings } from '../lib/storage.js';
import { testConnection } from '../lib/llm.js';

export function Settings() {
  const [provider, setProvider] = useState<Provider>('google');
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState<string>('');
  const [status, setStatus] = useState<{ kind: 'idle' | 'testing' | 'ok' | 'err'; message?: string }>({ kind: 'idle' });

  useEffect(() => {
    getSettings().then((s) => {
      if (s.provider) setProvider(s.provider);
      if (s.apiKey) setApiKey(s.apiKey);
      if (s.model) setModel(s.model);
    });
  }, []);

  useEffect(() => {
    const opts = MODEL_OPTIONS[provider];
    if (!opts.includes(model)) setModel(opts[0]!);
  }, [provider, model]);

  const handleSave = async () => {
    setStatus({ kind: 'testing' });
    const result = await testConnection({ provider, apiKey, model: model || null });
    if (!result.ok) {
      setStatus({ kind: 'err', message: result.error ?? 'unknown error' });
      return;
    }
    const s = await getSettings();
    await saveSettings({ ...s, provider, apiKey, model });
    setStatus({ kind: 'ok', message: `connected · ${result.latencyMs}ms` });
  };

  return (
    <div className="popup">
      <h1>Banger</h1>

      <label>Provider</label>
      <select value={provider} onChange={(e) => setProvider(e.currentTarget.value as Provider)}>
        {PROVIDERS.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>

      <label>API key</label>
      <input
        type="password"
        value={apiKey}
        onChange={(e) => setApiKey(e.currentTarget.value)}
        placeholder="paste your key"
      />

      <label>Model</label>
      <select value={model} onChange={(e) => setModel(e.currentTarget.value)}>
        {MODEL_OPTIONS[provider].map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>

      <button onClick={handleSave} disabled={!apiKey || status.kind === 'testing'}>
        {status.kind === 'testing' ? 'Testing\u2026' : 'Save & Test'}
      </button>

      {status.kind === 'ok' && <div className="status ok">\u2713 {status.message}</div>}
      {status.kind === 'err' && <div className="status err">\u2717 {status.message}</div>}
    </div>
  );
}
