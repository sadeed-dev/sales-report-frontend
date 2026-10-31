import { toPng } from 'html-to-image'

const crcTable = new Uint32Array(256).map((_, index) => {
  let crc = index
  for (let bit = 0; bit < 8; bit += 1) crc = (crc & 1) ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1
  return crc >>> 0
})

function pngChunk(type, data) {
  const chunk = new Uint8Array(data.length + 12)
  const view = new DataView(chunk.buffer)
  view.setUint32(0, data.length)
  chunk.set(new TextEncoder().encode(type), 4)
  chunk.set(data, 8)
  let crc = 0xffffffff
  for (const byte of chunk.subarray(4, chunk.length - 4)) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8)
  view.setUint32(chunk.length - 4, (crc ^ 0xffffffff) >>> 0)
  return chunk
}

// Recompress only PNG's pixel stream. Keep its pixels, dimensions and metadata intact.
// Unsupported browsers keep the original lossless PNG.
export async function compressReportPng(blob) {
  if (typeof CompressionStream === 'undefined' || typeof DecompressionStream === 'undefined') return blob
  try {
    const bytes = new Uint8Array(await blob.arrayBuffer())
    if (bytes.length < 8 || ![137, 80, 78, 71, 13, 10, 26, 10].every((value, index) => bytes[index] === value)) return blob
    const view = new DataView(bytes.buffer)
    const chunks = []
    const imageData = []
    let offset = 8
    while (offset + 12 <= bytes.length) {
      const length = view.getUint32(offset)
      if (offset + length + 12 > bytes.length) return blob
      const type = String.fromCharCode(...bytes.subarray(offset + 4, offset + 8))
      chunks.push({ type, bytes: bytes.subarray(offset, offset + length + 12) })
      if (type === 'IDAT') imageData.push(bytes.subarray(offset + 8, offset + 8 + length))
      offset += length + 12
    }
    if (!imageData.length || offset !== bytes.length) return blob
    const stream = new Blob(imageData).stream().pipeThrough(new DecompressionStream('deflate')).pipeThrough(new CompressionStream('deflate'))
    const compressed = new Uint8Array(await new Response(stream).arrayBuffer())
    const parts = [bytes.subarray(0, 8)]
    let inserted = false
    for (const chunk of chunks) {
      if (chunk.type !== 'IDAT') parts.push(chunk.bytes)
      else if (!inserted) {
        parts.push(pngChunk('IDAT', compressed))
        inserted = true
      }
    }
    const result = new Blob(parts, { type: 'image/png' })
    return result.size < blob.size ? result : blob
  } catch {
    return blob
  }
}

export async function renderReportPng(node, { minWidth = 1920, minHeight = 0 } = {}) {
  await document.fonts.ready
  const { width, height } = node.getBoundingClientRect()
  if (!(width > 0) || !(height > 0)) throw new Error('Report image has no measurable size')
  const dataUrl = await toPng(node, {
    pixelRatio: Math.max(3, Math.ceil(minWidth / width), Math.ceil(minHeight / height)),
    backgroundColor: '#ffffff',
    cacheBust: true,
    // Fail rather than silently scaling down a report that exceeds browser canvas limits.
    skipAutoScale: true,
  })
  if (!dataUrl.startsWith('data:image/png;base64,')) throw new Error('Report exceeds this browser\'s image size limit')
  const original = await (await fetch(dataUrl)).blob()
  return compressReportPng(original)
}
