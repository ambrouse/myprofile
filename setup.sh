#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORT="${1:-8000}"

cd "$ROOT_DIR"

echo "[setup] Starting static server at http://localhost:${PORT}"

run_python_server() {
  local python_cmd="$1"

  if ! command -v "$python_cmd" >/dev/null 2>&1; then
    return 1
  fi

  if ! "$python_cmd" -c "import http.server, sys" >/dev/null 2>&1; then
    return 1
  fi

  "$python_cmd" -m http.server "$PORT"
}

run_py_launcher_server() {
  local py_cmd="$1"

  if ! command -v "$py_cmd" >/dev/null 2>&1; then
    return 1
  fi

  if ! "$py_cmd" -3 -c "import http.server, sys" >/dev/null 2>&1; then
    return 1
  fi

  "$py_cmd" -3 -m http.server "$PORT"
}

run_node_server() {
  if ! command -v node >/dev/null 2>&1; then
    return 1
  fi

  node -e '
const fs = require("fs");
const http = require("http");
const path = require("path");
const { fileURLToPath } = require("url");

const root = process.cwd();
const port = Number(process.argv[1]);
const types = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".map", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".svg", "image/svg+xml"],
  [".webp", "image/webp"]
]);

http.createServer((req, res) => {
  const urlPath = fileURLToPath(`file://${decodeURI(req.url.split("?")[0])}`);
  const safePath = path.normalize(urlPath).replace(/^(\.\.(\/|\\|$))+/, "");
  let filePath = path.join(root, safePath);

  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, "index.html");
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    res.writeHead(200, {
      "Content-Type": types.get(path.extname(filePath).toLowerCase()) || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    res.end(data);
  });
}).listen(port, () => {
  console.log(`[setup] Node static server running at http://localhost:${port}`);
});
' "$PORT"
}

if run_python_server python3; then
  exit 0
elif run_python_server python; then
  exit 0
elif run_py_launcher_server py; then
  exit 0
elif run_py_launcher_server py.exe; then
  exit 0
elif run_node_server; then
  exit 0
else
  echo "[setup] Python or Node.js is required but no working runtime was found."
  echo "[setup] Install Python 3 or Node.js, then run: ./setup.sh ${PORT}"
  exit 1
fi
