from jose import JWTError, jwt
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.core.config import settings

bearer = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer),
):
    token = credentials.credentials
    try:
        # jose.jwt.decode returns the claims dict
        payload = jwt.decode(
            token,
            settings.SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
        )
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    # Optionally, you can verify more claims here (iss, exp, etc.)
    return payload
