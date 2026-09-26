import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const source = ts.transpileModule(fs.readFileSync('lib/analytics.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true } }).outputText;
function setup({ debug = false, consent, internal = false, pathname = '/', production = false, host = 'https://us.i.posthog.com' } = {}) {
  const storage = new Map();
  if (consent) storage.set('analytics-consent', consent);
  if (internal) storage.set('analytics-internal', '1');
  const events = [], logs = [];
  const ph = { __loaded: false, init(key, config) { this.__loaded = true; this.config = config; config.loaded(this); }, capture(event) { events.push(event); }, debug() {}, set_config() {}, opt_in_capturing() {}, opt_out_capturing() {}, startSessionRecording() {}, stopSessionRecording() {}, sessionRecordingStarted() { return false; } };
  const testModule = { exports: {} };
  vm.runInNewContext(source, { module: testModule, exports: testModule.exports, require: () => ph, process: { env: { NODE_ENV: production ? 'production' : 'development', NEXT_PUBLIC_POSTHOG_KEY: 'phc_test', NEXT_PUBLIC_POSTHOG_DEBUG: String(debug), NEXT_PUBLIC_POSTHOG_HOST: host } }, window: { location: { pathname, search: '', origin: 'https://example.com' }, localStorage: { getItem: k => storage.get(k) ?? null, setItem: (k, v) => storage.set(k, v) } }, navigator: { doNotTrack: '0' }, document: { addEventListener() {} }, URL, URLSearchParams, console: { info: v => logs.push(v), warn: v => logs.push(v) } });
  return { api: testModule.exports, ph, events, logs };
}
test('local capture is off by default and explains how to opt in', () => {
  const { api, ph, logs } = setup(); api.initAnalytics();
  assert.equal(ph.__loaded, false); assert.match(logs[0], /development-disabled/);
});
test('explicit local debug initializes and captures a public event', () => {
  const { api, ph, events } = setup({ debug: true }); api.track('theme_changed');
  assert.equal(ph.__loaded, true); assert.deepEqual(events, ['theme_changed']);
  assert.equal(ph.config.capture_pageview, 'history_change'); assert.equal(ph.config.persistence, 'memory');
});
test('production capture does not require debug', () => {
  const { api, ph } = setup({ production: true }); api.initAnalytics(); assert.equal(ph.__loaded, true);
});
test('debug respects denied consent and excluded browsers', () => {
  for (const options of [{ consent: 'denied' }, { internal: true }]) {
    const { api, ph, events } = setup({ debug: true, ...options }); api.track('theme_changed');
    assert.equal(ph.__loaded, false); assert.equal(events.length, 0);
  }
});
test('named events are never sent from admin or auth pages', () => {
  for (const pathname of ['/admin', '/admin/posts', '/login', '/signup', '/reset-password']) {
    const { api, events } = setup({ debug: true, pathname }); api.initAnalytics(); api.track('theme_changed'); assert.equal(events.length, 0);
  }
});
test('before_send filters automatic private page events', () => {
  const { api, ph } = setup({ debug: true }); api.initAnalytics();
  assert.equal(ph.config.before_send({ properties: { $current_url: 'https://example.com/admin/posts' } }), null);
  const publicEvent = { properties: { $current_url: 'https://example.com/projects/demo' } };
  assert.equal(ph.config.before_send(publicEvent), publicEvent);
});
test('EU configuration uses the matching PostHog dashboard', () => {
  const { api, ph } = setup({ debug: true, host: 'https://eu.i.posthog.com' }); api.initAnalytics(); assert.equal(ph.config.ui_host, 'https://eu.posthog.com');
});
