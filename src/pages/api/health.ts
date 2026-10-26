import type { APIRoute } from 'astro';
import soal from '../../data/soal.json';
import materi from '../../data/materi.json';

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      ok: true,
      app: 'tanyaruang',
      soal: soal.length,
      materi: materi.length,
    }),
    { headers: { 'content-type': 'application/json' } }
  );
};
