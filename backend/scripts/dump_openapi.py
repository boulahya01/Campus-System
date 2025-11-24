#!/usr/bin/env python3
"""Dump the FastAPI OpenAPI spec to backend/openapi.json
Run: python -m app.scripts.dump_openapi
"""
import json
import os, sys
# ensure backend package root is on sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from app.main import app

spec = app.openapi()
with open("openapi.json", "w", encoding="utf-8") as f:
    json.dump(spec, f, ensure_ascii=False, indent=2)
print("Wrote backend/openapi.json")
