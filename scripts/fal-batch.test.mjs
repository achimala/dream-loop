import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { runBatch } from './fal-batch.mjs';

function fixture(t, count = 2) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'fal-batch-test-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const filename = path.join(dir, 'jobs.json');
  // A real tiny PNG fixture; only local mocked fetches are used in these tests.
  fs.writeFileSync(path.join(dir, 'input.png'), Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a5XcAAAAASUVORK5CYII=', 'base64'));
  fs.writeFileSync(filename, JSON.stringify({ jobs: Array.from({ length: count }, (_, i) => ({ id: `asset-${i}`, endpoint: 'test/model/variant', image: 'input.png', output: `models/${i}.glb` })) }));
  return { dir, filename, read: () => JSON.parse(fs.readFileSync(filename)) };
}
const json = data => new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
function glb() {
  const raw = JSON.stringify({ asset: { version: '2.0' } });
  const body = Buffer.from(raw.padEnd(Math.ceil(raw.length / 4) * 4, ' '));
  const b = Buffer.alloc(20 + body.length);
  b.write('glTF'); b.writeUInt32LE(2, 4); b.writeUInt32LE(b.length, 8);
  b.writeUInt32LE(body.length, 12); b.write('JSON', 16); body.copy(b, 20);
  return b;
}

test('submits concurrently, saves returned URLs, resumes without duplicate spending, and collects GLBs', async t => {
  const f = fixture(t); let active = 0, peak = 0, posts = 0;
  const fetchFn = async (url, options) => {
    if (options.method === 'POST') {
      const i = posts++; active++; peak = Math.max(peak, active);
      assert.match(JSON.parse(options.body).image_url, /^data:image\/png;base64,.+/);
      await new Promise(resolve => setTimeout(resolve, 10)); active--;
      return json({ request_id: `r${i}`, status: 'IN_QUEUE', status_url: `https://queue.fal.run/returned/r${i}/status`, response_url: `https://queue.fal.run/returned/r${i}/result` });
    }
    if (url.endsWith('/status')) return json({ status: 'COMPLETED' });
    if (url.endsWith('/result')) return json({ model_mesh: { url: 'https://files.example/model.glb' } });
    assert.equal(url, 'https://files.example/model.glb');
    assert.equal(options.headers, undefined, 'download must not receive Fal credentials');
    return new Response(glb());
  };
  const config = { key: 'test-only-key', fetchFn };
  await runBatch('submit', f.filename, config);
  assert.equal(peak, 2); assert.equal(posts, 2);
  assert.ok(f.read().jobs.every(j => j.status_url.includes('/returned/')));
  await runBatch('submit', f.filename, config); assert.equal(posts, 2);
  const rows = await runBatch('collect', f.filename, config);
  assert.ok(rows.every(row => row.state === 'downloaded'));
  assert.deepEqual(fs.readFileSync(path.join(f.dir, 'models/0.glb')), glb());
});

test('invalid inputs never reach the paid submission API', async t => {
  const f = fixture(t, 1); fs.writeFileSync(path.join(f.dir, 'input.png'), '');
  let called = false;
  const rows = await runBatch('submit', f.filename, { key: 'test-only-key', fetchFn: () => { called = true; } });
  assert.equal(called, false); assert.ok(rows[0].error);
});

test('uncertain submissions are not retried automatically', async t => {
  const f = fixture(t, 1); let calls = 0;
  const options = { key: 'test-only-key', fetchFn: async () => { calls++; throw new Error('network timeout'); } };
  await runBatch('submit', f.filename, options);
  assert.equal(f.read().jobs[0].state, 'submission-uncertain');
  await runBatch('submit', f.filename, options); assert.equal(calls, 1);
});

test('preconnection failures are retryable and retain their diagnostic code', async t => {
  const f = fixture(t, 1);
  const rows = await runBatch('submit', f.filename, { key: 'test-only-key', fetchFn: async () => {
    throw new Error('fetch failed', { cause: { code: 'ENOTFOUND' } });
  } });
  assert.equal(rows[0].state, 'not-submitted');
  assert.equal(rows[0].connection_error, 'ENOTFOUND');
  let called = false;
  await runBatch('submit', f.filename, { key: 'test-only-key', fetchFn: async () => {
    called = true;
    return json({ request_id: 'retried', status_url: 'https://queue.fal.run/status', response_url: 'https://queue.fal.run/result' });
  } });
  assert.equal(called, true); assert.equal(f.read().jobs[0].request_id, 'retried');
});

test('404 results remain unresolved without overwriting an output with an error page', async t => {
  const f = fixture(t, 1), data = f.read();
  Object.assign(data.jobs[0], { request_id: 'r1', status_url: 'https://queue.fal.run/status', response_url: 'https://queue.fal.run/result' });
  fs.writeFileSync(f.filename, JSON.stringify(data));
  const rows = await runBatch('collect', f.filename, { key: 'test-only-key', fetchFn: async url => url.endsWith('/status') ? json({ status: 'COMPLETED' }) : new Response('not found', { status: 404 }) });
  assert.equal(rows[0].error, 'Fal HTTP 404');
  assert.notEqual(rows[0].state, 'downloaded');
  assert.equal(fs.existsSync(path.join(f.dir, 'models/0.glb')), false);
});

test('offline preflight catches the wrong Trellis route and mixed-model options before any paid request', async t => {
  const f = fixture(t, 1), data = f.read(); let calls = 0;
  const config = { key: '', fetchFn: async () => { calls++; } };
  data.jobs[0].endpoint = 'fal-ai/trellis/image-to-3d';
  fs.writeFileSync(f.filename, JSON.stringify(data));
  await assert.rejects(runBatch('check', f.filename, config), /no \/image-to-3d suffix/);
  data.jobs[0].endpoint = 'fal-ai/trellis'; data.jobs[0].input = { face_limit: 200000 };
  fs.writeFileSync(f.filename, JSON.stringify(data));
  await assert.rejects(runBatch('check', f.filename, config), /H3.1 option/);
  data.jobs[0].input = { mesh_simplify: .95, texture_size: 1024 };
  fs.writeFileSync(f.filename, JSON.stringify(data));
  const before = fs.readFileSync(f.filename, 'utf8');
  assert.equal((await runBatch('check', f.filename, config))[0].state, 'ready');
  assert.equal(calls, 0); assert.equal(fs.readFileSync(f.filename, 'utf8'), before);
});

test('422 submission reports sanitized field errors and can be corrected without an uncertain-job retry', async t => {
  const f = fixture(t, 1); const key = 'test-only-secret-key';
  const rows = await runBatch('submit', f.filename, { key, fetchFn: async () => new Response(JSON.stringify({
    detail: [{ loc: ['body', 'texture_size'], msg: `Invalid size ${key} data:image/png;base64,AAAA`, input: 'DO NOT SAVE THIS IMAGE' }],
  }), { status: 422 }) });
  assert.equal(rows[0].state, 'rejected'); assert.equal(rows[0].error_stage, 'submit');
  assert.match(rows[0].error_detail, /body.texture_size: Invalid size/);
  const saved = fs.readFileSync(f.filename, 'utf8');
  for (const value of [key, 'DO NOT SAVE THIS IMAGE', 'base64,AAAA']) assert.equal(saved.includes(value), false);
  let calls = 0;
  await runBatch('submit', f.filename, { key, fetchFn: async () => { calls++; return json({request_id:'fixed',status_url:'https://queue.fal.run/status',response_url:'https://queue.fal.run/result'}); } });
  assert.equal(calls, 1); assert.equal(f.read().jobs[0].request_id, 'fixed');
});

test('failed completed results retain their request identity and explain the failure without resubmitting', async t => {
  const f = fixture(t, 1), data = f.read();
  Object.assign(data.jobs[0], { endpoint:'fal-ai/trellis/image-to-3d', request_id:'accepted', status_url:'https://queue.fal.run/status',response_url:'https://queue.fal.run/result' });
  fs.writeFileSync(f.filename, JSON.stringify(data));
  let posts = 0;
  const config = {key:'test-only-key',fetchFn:async (url, opts) => {
    if (opts.method === 'POST') posts++;
    return url.endsWith('/status') ? json({status:'COMPLETED'}) : new Response(JSON.stringify({detail:'Model generation failed; invalid topology'}), {status:422});
  }};
  const rows = await runBatch('collect', f.filename, config);
  assert.equal(rows[0].state, 'result-error'); assert.equal(rows[0].request_id, 'accepted');
  assert.equal(rows[0].error_detail, 'Model generation failed; invalid topology');
  await runBatch('submit', f.filename, config); assert.equal(posts, 0);
});

test('partial accepted response preserves its ID and missing IDs cannot bypass existing queue records', async t => {
  const f = fixture(t, 1);
  const rows = await runBatch('submit', f.filename, {key:'test-only-key',fetchFn:async () => json({request_id:'partial-accepted'})});
  assert.equal(rows[0].request_id, 'partial-accepted'); assert.equal(rows[0].state, 'submission-uncertain');
  const data=f.read();delete data.jobs[0].request_id;
  Object.assign(data.jobs[0], {state:'IN_QUEUE',response_url:'https://queue.fal.run/result'});
  fs.writeFileSync(f.filename, JSON.stringify(data));
  let called=false;
  const retry=await runBatch('submit',f.filename,{key:'test-only-key',fetchFn:async()=>{called=true;}});
  assert.equal(called,false);assert.match(retry[0].error,/Recover the original record/);
});
