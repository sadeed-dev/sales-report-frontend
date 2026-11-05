export async function downloadReportZip(response, filename) {
  const blob = response.data;
  if (!(blob instanceof Blob)) throw new Error('The server did not return a report file.');
  const signature = new Uint8Array(await blob.slice(0, 4).arrayBuffer());
  if (signature[0] !== 0x50 || signature[1] !== 0x4b ||
      !((signature[2] === 3 && signature[3] === 4) || (signature[2] === 5 && signature[3] === 6))) {
    throw { response }; // Decode JSON errors even if a proxy returned HTTP 200.
  }
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  try {
    document.body.appendChild(link);
    link.click();
  } finally {
    link.remove();
    // Allow the browser to start reading the file before releasing the URL.
    window.setTimeout(() => window.URL.revokeObjectURL(url), 60000);
  }
}

export async function reportDownloadError(error, fallback) {
  const data = error.response?.data;
  if (data instanceof Blob) {
    try {
      const body = JSON.parse(await data.text());
      if (typeof body.message === 'string' && body.message) return body.message;
    } catch { /* A proxy may return HTML instead of JSON. */ }
  } else if (typeof data?.message === 'string' && data.message) {
    return data.message;
  }
  if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
    return 'The report took too long to generate. Please try a smaller date range.';
  }
  if ([502, 503, 504].includes(error.response?.status)) {
    return 'The report server is busy or timed out. Please try again with a smaller date range.';
  }
  return fallback;
}
