const fs = require('fs');
const zlib = require('zlib');

function createPNG(size, drawFn) {
  const pixels = new Uint8Array(size * size * 4);

  // Helper: set pixel at (x, y) with RGBA
  function setPixel(x, y, r, g, b, a = 255) {
    if (x < 0 || x >= size || y < 0 || y >= size) return;
    const i = (y * size + x) * 4;
    pixels[i] = r;
    pixels[i + 1] = g;
    pixels[i + 2] = b;
    pixels[i + 3] = a;
  }

  // Helper: draw a filled circle
  function fillCircle(cx, cy, radius, r, g, b, a = 255) {
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
        if (dist <= radius) {
          setPixel(x, y, r, g, b, a);
        }
      }
    }
  }

  // Helper: draw a line using Bresenham's algorithm
  function drawLine(x0, y0, x1, y1, r, g, b, a = 255) {
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;
    while (true) {
      setPixel(x0, y0, r, g, b, a);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 > -dy) { err -= dy; x0 += sx; }
      if (e2 < dx) { err += dx; y0 += sy; }
    }
  }

  // Helper: draw a filled polygon
  function fillPolygon(points, r, g, b, a = 255) {
    const minY = Math.min(...points.map(p => p[1]));
    const maxY = Math.max(...points.map(p => p[1]));
    for (let y = minY; y <= maxY; y++) {
      const intersections = [];
      for (let i = 0; i < points.length; i++) {
        const [x0, y0] = points[i];
        const [x1, y1] = points[(i + 1) % points.length];
        if ((y0 <= y && y1 > y) || (y1 <= y && y0 > y)) {
          intersections.push(x0 + (y - y0) / (y1 - y0) * (x1 - x0));
        }
      }
      intersections.sort((a, b) => a - b);
      for (let i = 0; i < intersections.length; i += 2) {
        for (let x = Math.ceil(intersections[i]); x < intersections[i + 1]; x++) {
          setPixel(x, y, r, g, b, a);
        }
      }
    }
  }

  // Helper: draw a thick line
  function drawThickLine(x0, y0, x1, y1, thickness, r, g, b, a = 255) {
    const dx = x1 - x0;
    const dy = y1 - y0;
    const len = Math.sqrt(dx * dx + dy * dy);
    const nx = -dy / len * thickness / 2;
    const ny = dx / len * thickness / 2;
    fillPolygon([
      [x0 + nx, y0 + ny],
      [x0 - nx, y0 - ny],
      [x1 - nx, y1 - ny],
      [x1 + nx, y1 + ny],
    ], r, g, b, a);
  }

  drawFn(size, setPixel, fillCircle, drawLine, drawThickLine, fillPolygon);

  // Build PNG
  const rows = [];
  for (let y = 0; y < size; y++) {
    const row = new Uint8Array(size * 4 + 1);
    row[0] = 0; // filter: none
    row.set(pixels.subarray(y * size * 4, (y + 1) * size * 4), 1);
    rows.push(row);
  }

  const rawData = Buffer.concat(rows);
  const compressed = zlib.deflateSync(rawData);

  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(size, 0);
  ihdrData.writeUInt32BE(size, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // color type: RGBA
  const ihdr = makeChunk('IHDR', ihdrData);

  // IDAT chunk
  const idat = makeChunk('IDAT', compressed);

  // IEND chunk
  const iend = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

function makeChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type);
  const crcData = Buffer.concat([typeBuf, data]);
  const crc = crc32(crcData);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc, 0);
  return Buffer.concat([length, typeBuf, data, crcBuf]);
}

function crc32(buf) {
  let c = 0xFFFFFFFF;
  const table = [];
  for (let n = 0; n < 256; n++) {
    let k = n;
    for (let i = 0; i < 8; i++) {
      k = k & 1 ? 0xEDB88320 ^ (k >>> 1) : k >>> 1;
    }
    table[n] = k;
  }
  for (let i = 0; i < buf.length; i++) {
    c = table[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  }
  return (c ^ 0xFFFFFFFF) >>> 0;
}

// --- Draw the icon: abstract tracker/compass shape ---
function drawIcon(size, setPixel, fillCircle, drawLine, drawThickLine, fillPolygon) {
  const cx = size / 2;
  const cy = size / 2;

  // Background: dark rounded feel (fill entire square)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // Gradient background: dark purple to dark blue
      const t = (x + y) / (size * 2);
      const r = Math.round(15 + t * 20);
      const g = Math.round(15 + t * 10);
      const b = Math.round(25 + t * 30);
      setPixel(x, y, r, g, b);
    }
  }

  // Outer ring (circle outline)
  const ringR = size * 0.35;
  const ringW = Math.max(2, size * 0.06);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      if (dist >= ringR - ringW && dist <= ringR + ringW) {
        // Purple-blue gradient ring
        const angle = Math.atan2(y - cy, x - cx);
        const t = (angle + Math.PI) / (2 * Math.PI);
        const r = Math.round(167 * (1 - t) + 96 * t);
        const g = Math.round(139 * (1 - t) + 165 * t);
        const b = Math.round(250 * (1 - t) + 250 * t);
        setPixel(x, y, r, g, b);
      }
    }
  }

  // Arrow/compass needle pointing up-right (tracker concept)
  const arrowLen = size * 0.28;
  const arrowW = size * 0.08;
  const angle = -Math.PI / 4; // 45 degrees up-right
  const tipX = cx + Math.cos(angle) * arrowLen;
  const tipY = cy + Math.sin(angle) * arrowLen;
  const baseX = cx - Math.cos(angle) * arrowLen * 0.4;
  const baseY = cy - Math.sin(angle) * arrowLen * 0.4;
  const perpX = -Math.sin(angle) * arrowW;
  const perpY = Math.cos(angle) * arrowW;

  fillPolygon([
    [tipX, tipY],
    [baseX + perpX, baseY + perpY],
    [baseX - perpX, baseY - perpY],
  ], 124, 58, 237); // Purple arrow

  // Small dot at center
  fillCircle(cx, cy, Math.max(2, size * 0.05), 96, 165, 250);
}

// Generate icons at different sizes
const sizes = [16, 32, 48, 128];
sizes.forEach(s => {
  const png = createPNG(s, drawIcon);
  fs.writeFileSync(`icon${s}.png`, png);
  console.log(`Created icon${s}.png (${png.length} bytes)`);
});
