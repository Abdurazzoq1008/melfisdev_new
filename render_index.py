import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from app import app, index

with app.test_request_context():
    html = index()
    target_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "index.html")
    with open(target_path, "w", encoding="utf-8") as f:
        f.write(html)
    print("SUCCESS: Rendered HTML length =", len(html))

