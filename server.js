// Mini application de validation des volumes persistants Eflex.
// Aucune dépendance : uniquement le module `http` de Node.
//
//   GET /       -> "ok"
//   GET /write  -> écrit un horodatage dans /data/eflex-volume-test.txt
//   GET /read   -> lit ce fichier (200 s'il existe, 404 sinon)
//
// /data est le point de montage du stockage persistant Coolify
// (`eflex-volume-test`, monté sur /data).

const http = require('node:http')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')

const PORT = Number(process.env.PORT || 3000)
const DATA_DIR = process.env.DATA_DIR || '/data'
const FILE = path.join(DATA_DIR, 'eflex-volume-test.txt')

function json(res, status, payload) {
  const body = JSON.stringify(payload)
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' })
  res.end(body)
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url || '/', `http://localhost:${PORT}`)

  if (url.pathname === '/') {
    res.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' })
    res.end('ok\n')
    return
  }

  if (url.pathname === '/write') {
    const stamp = new Date().toISOString()
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true })
      fs.writeFileSync(FILE, `ecrit=${stamp}\nhost=${os.hostname()}\n`, 'utf8')
      json(res, 200, { ok: true, file: FILE, stamp, host: os.hostname() })
    } catch (error) {
      json(res, 500, { ok: false, error: String(error) })
    }
    return
  }

  if (url.pathname === '/read') {
    try {
      const content = fs.readFileSync(FILE, 'utf8')
      json(res, 200, { ok: true, file: FILE, content, host: os.hostname() })
    } catch (error) {
      json(res, 404, { ok: false, file: FILE, error: String(error), host: os.hostname() })
    }
    return
  }

  json(res, 404, { ok: false, error: 'not found' })
})

server.listen(PORT, '0.0.0.0', () => {
  console.log(`volume-smoke à l'écoute sur :${PORT} (fichier ${FILE})`)
})
