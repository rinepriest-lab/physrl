"""헬스체크 API 엔드포인트."""

from http.server import BaseHTTPRequestHandler
import json


class handler(BaseHTTPRequestHandler):
    """헬스체크 핸들러."""

    def do_GET(self):
        """GET 요청 처리 - API 상태 확인."""
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()

        response = {
            "status": "ok",
            "message": "PhysRL API is running",
        }

        self.wfile.write(json.dumps(response).encode())
