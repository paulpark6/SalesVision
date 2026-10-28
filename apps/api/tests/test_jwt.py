"""Supabase token check: accepts a valid token, rejects forged/expired/wrong-project ones. No DB or network.
    venv/bin/python tests/test_jwt.py
"""
import os
import sys
import time
from pathlib import Path

os.environ.setdefault("DATABASE_URL", "sqlite://")
os.environ["SUPABASE_URL"] = "https://abc.supabase.co"
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import jwt  # noqa: E402
from cryptography.hazmat.primitives.asymmetric import ec  # noqa: E402
from fastapi import HTTPException  # noqa: E402
from app.core import deps  # noqa: E402

key = ec.generate_private_key(ec.SECP256R1())


class FakeJWKS:
    def get_signing_key_from_jwt(self, _):
        return type("K", (), {"key": key.public_key()})()


deps._jwks = FakeJWKS()
base = dict(email="a@x.co", aud="authenticated", iss="https://abc.supabase.co/auth/v1", exp=int(time.time()) + 60)
tok = lambda **o: jwt.encode({**base, **o}, key, algorithm="ES256")  # noqa: E731

assert deps._verify_supabase_jwt(tok()) == "a@x.co"
bad = {
    "anon audience": tok(aud="anon"),
    "other project": tok(iss="https://evil.supabase.co/auth/v1"),
    "expired": tok(exp=1),
    "no email": tok(email=None),
    "HS256 downgrade": jwt.encode(base, "x" * 32, algorithm="HS256"),
    "wrong key": jwt.encode(base, ec.generate_private_key(ec.SECP256R1()), algorithm="ES256"),
}
for name, t in bad.items():
    try:
        deps._verify_supabase_jwt(t)
        raise AssertionError(f"accepted: {name}")
    except HTTPException as e:
        assert e.status_code == 401, name

print("jwt check passed")
