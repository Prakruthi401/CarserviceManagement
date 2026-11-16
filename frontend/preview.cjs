// Local-only static preview with an API proxy. Run npm run build first.
const http = require('http');
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, 'build');
const port = Number(process.env.PORT || 3000);
const apiPort = Number(process.env.API_PORT || 8080);
const types = {'.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.json':'application/json', '.svg':'image/svg+xml', '.png':'image/png', '.ico':'image/x-icon'};
if (!fs.existsSync(path.join(root, 'index.html'))) {
  throw new Error('Run npm run build before npm run preview.');
}
http.createServer((req, res) => {
  if (req.url.startsWith('/api/')) {
    const proxy = http.request({hostname:'127.0.0.1', port:apiPort, path:req.url, method:req.method, headers:req.headers}, upstream => {
      res.writeHead(upstream.statusCode, upstream.headers);
      upstream.pipe(res);
    });
    proxy.on('error', () => { res.writeHead(502); res.end('Local backend unavailable. Start the backend first.'); });
    req.pipe(proxy);
    return;
  }
  if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405); res.end(); return; }
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { res.writeHead(400); res.end(); return; }
  let file = path.resolve(root, '.' + pathname);
  if (file !== root && !file.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
  if (!path.extname(file)) file = path.join(root, 'index.html');
  fs.stat(file, (err, stat) => {
    if (err || !stat.isFile()) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, {'Content-Type': types[path.extname(file)] || 'application/octet-stream'});
    if (req.method === 'HEAD') { res.end(); return; }
    fs.createReadStream(file).pipe(res);
  });
}).listen(port, '127.0.0.1', () => console.log(`Local preview: http://localhost:${port}`));
