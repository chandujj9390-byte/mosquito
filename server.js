const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'text/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject'
};

function serveFile(filePath, res, statusCode = 200) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  
  res.writeHead(statusCode, {
    'Content-Type': contentType,
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=86400'
  });
  
  fs.createReadStream(filePath).pipe(res);
}

function send404(res) {
  const custom404Path = path.join(__dirname, '404.html');
  fs.stat(custom404Path, (err, stats) => {
    if (!err && stats.isFile()) {
      serveFile(custom404Path, res, 404);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
      res.end(`<!DOCTYPE html><html><head><title>404 - Page Not Found | MOSQUITO</title><style>body{background:#F8F8F6;color:#121212;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;flex-direction:column}h1{font-size:3rem;margin:0}p{color:#666}a{color:#fff;background:#121212;padding:12px 24px;border-radius:999px;text-decoration:none;margin-top:20px;font-size:12px;text-transform:uppercase;font-weight:bold;letter-spacing:1px}</style></head><body><h1>404</h1><p>The requested page or asset could not be found.</p><a href="/">Return to Store</a></body></html>`);
    }
  });
}

const server = http.createServer((req, res) => {
  const rawUrl = req.url.split('?')[0];
  const decodedUrl = decodeURIComponent(rawUrl).trim();

  // 1. Explicit root route resolution
  if (!decodedUrl || decodedUrl === '/' || decodedUrl === '/index' || decodedUrl === '/index.html') {
    return serveFile(path.join(__dirname, 'index.html'), res);
  }

  let safePath = path.normalize(decodedUrl).replace(/^(\.\.[\/\\])+/, '');
  
  // Potential candidate paths to check (Root, public/, assets/)
  const candidates = [
    path.join(__dirname, safePath),
    path.join(__dirname, 'public', safePath),
    path.join(__dirname, 'assets', safePath),
    path.join(__dirname, 'public', 'assets', safePath.replace(/^assets[\/\\]/, ''))
  ];

  // Also check extensionless HTML (e.g., /checkout -> /checkout.html)
  candidates.push(path.join(__dirname, safePath + '.html'));
  candidates.push(path.join(__dirname, 'public', safePath + '.html'));

  function tryNext(index) {
    if (index >= candidates.length) {
      return send404(res);
    }

    const currentPath = candidates[index];
    fs.stat(currentPath, (err, stats) => {
      if (!err && stats.isFile()) {
        return serveFile(currentPath, res);
      } else if (!err && stats.isDirectory()) {
        const dirIndex = path.join(currentPath, 'index.html');
        fs.stat(dirIndex, (dirErr, dirStats) => {
          if (!dirErr && dirStats.isFile()) {
            return serveFile(dirIndex, res);
          }
          tryNext(index + 1);
        });
      } else {
        tryNext(index + 1);
      }
    });
  }

  tryNext(0);
});

server.listen(PORT, () => {
  console.log(`MOSQUITO server running smoothly on http://localhost:${PORT}`);
});
