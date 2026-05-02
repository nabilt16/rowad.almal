import { Router } from 'express';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const router = Router();

const CACHE_DIR = path.resolve(process.cwd(), 'cache', 'tts');
if (!existsSync(CACHE_DIR)) mkdirSync(CACHE_DIR, { recursive: true });

const VOICE_ID = process.env.ELEVENLABS_VOICE_ID ?? 'rPNcQ53R703tTmtue1AT';

async function fetchElevenLabsAudio(text: string): Promise<Buffer> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) throw new Error('ELEVENLABS_API_KEY is not set');

  console.log(`[TTS] using voice ID: ${VOICE_ID}`);
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
      'Accept': 'audio/mpeg',
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: { stability: 0.5, similarity_boost: 0.75 },
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    console.error(`[TTS] ElevenLabs API error — status: ${res.status}, body: ${detail}`);
    throw new Error(`ElevenLabs ${res.status}: ${detail}`);
  }

  return Buffer.from(await res.arrayBuffer());
}

// POST /api/tts  { text: string }
router.post('/', async (req, res) => {
  const text: string = (req.body?.text ?? '').trim();
  if (!text) {
    res.status(400).json({ error: 'text body field is required' });
    return;
  }

  const hash = createHash('sha256').update(text).digest('hex');
  const cachePath = path.join(CACHE_DIR, `${hash}.mp3`);

  try {
    if (existsSync(cachePath)) {
      const cached = await readFile(cachePath);
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Content-Length', cached.length);
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.end(cached);
      return;
    }

    const audio = await fetchElevenLabsAudio(text);

    // persist to cache (non-blocking)
    writeFile(cachePath, audio).catch(err => console.error('[TTS cache] write error:', err));

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', audio.length);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.end(audio);
  } catch (err) {
    console.error('[TTS] error:', err);
    res.status(502).json({ error: 'TTS service unavailable' });
  }
});

export default router;
