import http.server, functools
class H(http.server.SimpleHTTPRequestHandler):
    extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map,
        ".html": "text/html; charset=utf-8", ".js": "application/javascript; charset=utf-8", ".css": "text/css; charset=utf-8"}
    def log_message(self, *a): pass
http.server.ThreadingHTTPServer(("127.0.0.1", 8790), functools.partial(H, directory="out")).serve_forever()
