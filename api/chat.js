const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const DEFAULT_MODEL = 'gpt-4o-mini';
const SYSTEM_PROMPT =
  'You are the official PNU GUIDE assistant. Answer in Korean. Be concise and helpful. Do not share personal or sensitive information.';

const sendJson = (res, status, payload) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
};

const parseBody = async (req) => {
  if (req.body) {
    if (typeof req.body === 'string') {
      try {
        return JSON.parse(req.body);
      } catch {
        return null;
      }
    }
    return req.body;
  }

  return await new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => {
      if (!data) {
        resolve(null);
        return;
      }
      try {
        resolve(JSON.parse(data));
      } catch {
        resolve(null);
      }
    });
    req.on('error', () => resolve(null));
  });
};

const normalizeMessages = (messages) => {
  if (!Array.isArray(messages)) return [];
  return messages
    .filter((item) => item && typeof item === 'object')
    .map((item) => {
      const role = item.role === 'assistant' ? 'assistant' : 'user';
      const content =
        typeof item.content === 'string' ? item.content.trim() : '';
      return { role, content };
    })
    .filter((item) => item.content);
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    sendJson(res, 405, { error: 'Method not allowed.' });
    return;
  }

  const apiKey = globalThis.process?.env?.OPENAI_API_KEY;
  if (!apiKey) {
    sendJson(res, 500, { error: 'OpenAI API key is missing.' });
    return;
  }

  const body = await parseBody(req);
  const messages = normalizeMessages(body?.messages);
  if (messages.length === 0) {
    sendJson(res, 400, { error: 'Messages are required.' });
    return;
  }

  const model = globalThis.process?.env?.OPENAI_MODEL ?? DEFAULT_MODEL;

  let response;
  try {
    response = await globalThis.fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
        temperature: 0.6,
      }),
    });
  } catch {
    sendJson(res, 502, { error: 'OpenAI request failed.' });
    return;
  }

  if (!response.ok) {
    const raw = await response.text();
    let message = `OpenAI API error (${response.status}).`;
    try {
      const parsed = JSON.parse(raw);
      message = parsed?.error?.message ?? message;
    } catch {
      if (raw) {
        message = raw;
      }
    }
    sendJson(res, response.status, { error: message });
    return;
  }

  const data = await response.json();
  const reply = data?.choices?.[0]?.message?.content?.trim();
  if (!reply) {
    sendJson(res, 502, { error: 'OpenAI response was empty.' });
    return;
  }

  sendJson(res, 200, { reply });
}
