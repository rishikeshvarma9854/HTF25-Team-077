export interface WeatherResult {
  raw: any;
  summary: string;
}

const OPENWEATHER_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || 'models/text-bison-001';
const GEMINI_URL = import.meta.env.VITE_GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1beta2';

export async function fetchWeather(location?: string, lat?: number, lon?: number): Promise<WeatherResult | null> {
  if (!OPENWEATHER_KEY) return null;
  try {
    const params = new URLSearchParams({ appid: OPENWEATHER_KEY, units: 'metric' });
    if (location) params.set('q', location);
    else if (typeof lat === 'number' && typeof lon === 'number') {
      params.set('lat', String(lat));
      params.set('lon', String(lon));
    } else return null;

    const resp = await fetch(`https://api.openweathermap.org/data/2.5/weather?${params.toString()}`);
    if (!resp.ok) {
      console.warn('OpenWeather lookup failed', resp.status, await resp.text());
      return null;
    }
    const j = await resp.json();
    const summary = `${(j.weather && j.weather[0] && j.weather[0].description) || ''}, temp=${j.main?.temp ?? 'N/A'}C`;
    return { raw: j, summary };
  } catch (e) {
    console.warn('fetchWeather error', e);
    return null;
  }
}

export async function callGemini(prompt: string): Promise<string | null> {
  // Prefer calling a backend proxy to avoid CORS/auth issues and to keep keys secret.
  const proxy = import.meta.env.VITE_LLM_PROXY_URL || 'http://127.0.0.1:8000/llm';
  try {
    const resp = await fetch(proxy, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, temperature: 0.2 }),
    });
    if (resp.ok) {
      const j = await resp.json();
      return j?.text ?? null;
    }
    // if proxy returns an error, log and fall back to direct attempt
    console.warn('LLM proxy failed', resp.status, await resp.text());
  } catch (e) {
    console.warn('LLM proxy call error', e);
  }

  // If no proxy or proxy failed, fall back to attempting direct Gemini call from browser
  if (!GEMINI_KEY) return null;
  const base = GEMINI_URL.replace(/\/+$/, '');
  const path = `${base}/${GEMINI_MODEL}:generateText`;
  const body = { prompt: { text: prompt }, temperature: 0.2 };

  // Helper to try fetch with a given url and headers
  async function tryFetch(url: string, headers: Record<string, string>) {
    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });
      if (!resp.ok) {
        const txt = await resp.text();
        return { ok: false, status: resp.status, text: txt };
      }
      const j = await resp.json();
      return { ok: true, json: j };
    } catch (e) {
      return { ok: false, status: 0, text: String(e) };
    }
  }

  const looksLikeOauth = GEMINI_KEY.startsWith('ya29.');
  if (looksLikeOauth) {
    const attempt = await tryFetch(path, { Authorization: `Bearer ${GEMINI_KEY}`, 'Content-Type': 'application/json' });
    if (attempt.ok) {
      const j = attempt.json;
      if (j.candidates && j.candidates.length > 0) return j.candidates[0].content || j.candidates[0].output || JSON.stringify(j.candidates[0]);
      if (j.output && typeof j.output === 'string') return j.output;
      return JSON.stringify(j);
    }
    console.warn('Gemini OAuth attempt failed', attempt.status, attempt.text);
    return null;
  }

  const urlWithKey = `${path}?key=${encodeURIComponent(GEMINI_KEY)}`;
  const attemptKey = await tryFetch(urlWithKey, { 'Content-Type': 'application/json' });
  if (attemptKey.ok) {
    const j = attemptKey.json;
    if (j.candidates && j.candidates.length > 0) return j.candidates[0].content || j.candidates[0].output || JSON.stringify(j.candidates[0]);
    if (j.output && typeof j.output === 'string') return j.output;
    return JSON.stringify(j);
  }

  console.warn('Gemini API error', attemptKey.status, attemptKey.text);
  return null;
}

export function hasKeys() {
  return Boolean(GEMINI_KEY || OPENWEATHER_KEY);
}
