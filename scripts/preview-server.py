#!/usr/bin/env python3
"""Local demo server with a fixed PNG capture endpoint for visual review."""
import argparse
from datetime import datetime, timezone
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import json
from pathlib import Path


class Handler(SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path != "/__capture":
            self.send_error(404)
            return
        try:
            size = int(self.headers.get("Content-Length", "0"))
            if not 8 <= size <= 20_000_000:
                raise ValueError("Capture must be a PNG under 20 MB")
            data = self.rfile.read(size)
            if len(data) != size or data[:8] != b"\x89PNG\r\n\x1a\n":
                raise ValueError("Invalid PNG capture")
            folder = Path(self.directory) / ".dream-loop" / "captures"
            folder.mkdir(parents=True, exist_ok=True)
            stamp = datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%S-%f")
            capture = folder / f"frame-{stamp}.png"
            capture.write_bytes(data)
            (folder / "latest.png").write_bytes(data)
            payload = json.dumps({"path": str(capture), "latest": str(folder / "latest.png")}).encode()
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
        except (ValueError, OSError) as error:
            self.send_error(400, str(error))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--directory", default=str(Path.cwd()), help="Workspace to serve (default: current directory)")
    parser.add_argument("--port", type=int, default=4172)
    args = parser.parse_args()
    handler = partial(Handler, directory=str(Path(args.directory).resolve()))
    print(f"Preview http://127.0.0.1:{args.port}; POST PNG to /__capture", flush=True)
    ThreadingHTTPServer(("127.0.0.1", args.port), handler).serve_forever()
