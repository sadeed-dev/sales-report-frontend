import test from 'node:test';
import assert from 'node:assert/strict';
import { downloadReportZip, reportDownloadError } from '../src/lib/reportDownload.js';

test('server JSON errors remain readable when Axios returns a blob', async () => {
  const error = { response: { data: new Blob([JSON.stringify({ message: 'Failed to generate attendance image' })]) } };
  assert.equal(await reportDownloadError(error, 'fallback'), 'Failed to generate attendance image');
});

test('timeouts and proxy errors display actionable messages', async () => {
  assert.match(await reportDownloadError({ code: 'ECONNABORTED' }, 'fallback'), /smaller date range/);
  assert.match(await reportDownloadError({ response: { status: 504, data: new Blob(['<html>Gateway Timeout</html>']) } }, 'fallback'), /server is busy or timed out/);
  assert.equal(await reportDownloadError({}, 'fallback'), 'fallback');
});

test('HTTP 200 JSON responses are not downloaded as ZIP files', async () => {
  const response = { data: new Blob(['{"message":"Render failed"}']) };
  await assert.rejects(downloadReportZip(response, 'report.zip'), asyncError => asyncError.response === response);
});

test('a valid ZIP starts downloading before its object URL is released', async () => {
  const events = [];
  let cleanup;
  const previousWindow = globalThis.window;
  const previousDocument = globalThis.document;
  globalThis.window = {
    URL: { createObjectURL: () => 'blob:report', revokeObjectURL: url => events.push(url) },
    setTimeout: fn => { cleanup = fn; },
  };
  const link = { click: () => events.push('click'), remove: () => events.push('remove') };
  globalThis.document = { createElement: () => link, body: { appendChild: () => events.push('append') } };
  try {
    await downloadReportZip({ data: new Blob([new Uint8Array([0x50, 0x4b, 5, 6])]) }, 'empty.zip');
    assert.equal(link.download, 'empty.zip');
    assert.deepEqual(events, ['append', 'click', 'remove']);
    cleanup();
    assert.equal(events.at(-1), 'blob:report');
  } finally {
    globalThis.window = previousWindow;
    globalThis.document = previousDocument;
  }
});
