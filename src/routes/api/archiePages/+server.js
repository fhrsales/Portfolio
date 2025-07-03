// src/routes/api/archiePages/+server.js
import { writeFile } from 'fs/promises';
import { json } from '@sveltejs/kit';

const ARCHIE_PATH = 'static/archiePages.json';

export async function POST({ request }) {
  try {
    const data = await request.json();
    await writeFile(ARCHIE_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return json({ ok: true });
  } catch (e) {
    return new Response('Erro ao salvar arquivo: ' + e, { status: 500 });
  }
}
