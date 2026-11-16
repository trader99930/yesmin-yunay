#!/usr/bin/env python3
"""
Yesmin AI Assistant - Quick Local Browser / Webview Preview
Run this on Windows if you want to preview Yesmin immediately without installing Node.js.
Usage: python run_python_preview.py
"""

import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8085
DIRECTORY = os.path.join(os.path.dirname(os.path.abspath(__file__)), "assets", "hud")

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def main():
    print("=" * 60)
    print("    YESMIN AI ASSISTANT - LOCAL PREVIEW (WINDOWS/PC)")
    print("=" * 60)
    print(f"HUD Directory: {DIRECTORY}")
    print(f"Server URL: http://localhost:{PORT}")
    print("Opening browser...")

    webbrowser.open(f"http://localhost:{PORT}")

    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"\n[OK] Yesmin live at http://localhost:{PORT}")
        print("Press Ctrl+C to stop the server.")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")

if __name__ == "__main__":
    main()
