import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
if (!process.argv.includes('--production')) await import('./build.mjs');
const root=path.resolve('dist');
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.woff2':'font/woff2','.ttf':'font/ttf','.txt':'text/plain','.xml':'application/xml'};
const server=http.createServer(async(req,res)=>{
 try {
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
  if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}
  const info=await stat(file);if(!info.isFile())throw Error('Not found');
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(await readFile(file));
 }catch{res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});res.end('Seite nicht gefunden.');}
});
const port=Number(process.env.PORT)||5173;
server.listen(port,'127.0.0.1',()=>console.log(`OTTOYAMI preview: http://127.0.0.1:${port}`));
