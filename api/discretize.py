"""상태 이산화 API 엔드포인트."""

from http.server import BaseHTTPRequestHandler
import json
from urllib.parse import urlparse, parse_qs
import sys
import os

# src 디렉토리를 path에 추가
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))

from discretizer import StateDiscretizer


class handler(BaseHTTPRequestHandler):
    """상태 이산화 핸들러."""

    def send_json_response(self, status_code: int, data: dict):
        """JSON 응답을 전송."""
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())

    def do_OPTIONS(self):
        """OPTIONS 요청 처리 - CORS preflight."""
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        """GET 요청 처리 - 쿼리 파라미터로 상태 이산화."""
        try:
            parsed_url = urlparse(self.path)
            query_params = parse_qs(parsed_url.query)

            # 파라미터 추출
            position = float(query_params.get("position", [0])[0])
            velocity = float(query_params.get("velocity", [0])[0])
            angle = float(query_params.get("angle", [0])[0])
            angular_velocity = float(query_params.get("angular_velocity", [0])[0])
            n_bins = int(query_params.get("n_bins", [20])[0])

            # 이산화 실행
            discretizer = StateDiscretizer(n_bins=n_bins)
            import numpy as np

            state = np.array([position, velocity, angle, angular_velocity])
            discretized = discretizer.discretize(state)

            response = {
                "success": True,
                "discretized": list(discretized),
                "state_shape": list(discretizer.state_shape),
                "original_state": [position, velocity, angle, angular_velocity],
            }

            self.send_json_response(200, response)

        except ValueError as e:
            self.send_json_response(400, {"success": False, "error": f"Invalid parameter: {str(e)}"})
        except Exception as e:
            self.send_json_response(500, {"success": False, "error": str(e)})

    def do_POST(self):
        """POST 요청 처리 - JSON body로 상태 이산화."""
        try:
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length)
            data = json.loads(body)

            # 파라미터 추출
            state = data.get("state")
            n_bins = data.get("n_bins", 20)

            if state is None:
                self.send_json_response(400, {"success": False, "error": "Missing 'state' parameter"})
                return

            if not isinstance(state, list) or len(state) != 4:
                self.send_json_response(400, {"success": False, "error": "'state' must be a list of 4 numbers"})
                return

            # 이산화 실행
            discretizer = StateDiscretizer(n_bins=n_bins)
            import numpy as np

            state_array = np.array(state, dtype=float)
            discretized = discretizer.discretize(state_array)

            response = {
                "success": True,
                "discretized": list(discretized),
                "state_shape": list(discretizer.state_shape),
                "original_state": state,
            }

            self.send_json_response(200, response)

        except json.JSONDecodeError:
            self.send_json_response(400, {"success": False, "error": "Invalid JSON"})
        except Exception as e:
            self.send_json_response(500, {"success": False, "error": str(e)})
