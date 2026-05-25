const REPO = 'IsabelleIKN/isabelleikn.github.io';
const ALLOWED = new Set(['data.json', 'friend-data.json']);
const GH_API = `https://api.github.com/repos/${REPO}/contents/`;
const ORIGIN = 'https://isabelleikn.github.io';

const CORS = {
  'Access-Control-Allow-Origin': ORIGIN,
  'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }

    const file = new URL(request.url).pathname.slice(1);
    if (!ALLOWED.has(file)) return new Response('Not found', { status: 404 });

    const ghHeaders = {
      'Authorization': `Bearer ${env.GH_TOKEN}`,
      'Accept': 'application/vnd.github+json',
      'User-Agent': 'pkdx-worker',
    };

    let ghRes;
    if (request.method === 'GET') {
      ghRes = await fetch(GH_API + file, { headers: ghHeaders });
    } else if (request.method === 'PUT') {
      ghRes = await fetch(GH_API + file, {
        method: 'PUT',
        headers: { ...ghHeaders, 'Content-Type': 'application/json' },
        body: await request.text(),
      });
    } else {
      return new Response('Method not allowed', { status: 405 });
    }

    return new Response(await ghRes.text(), {
      status: ghRes.status,
      headers: { 'Content-Type': 'application/json', ...CORS },
    });
  },
};
