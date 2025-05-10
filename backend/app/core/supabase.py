# backend/app/core/supabase.py

from supabase import create_client
from app.core.config import settings

# initialize the client once
supabase = create_client(
    settings.SUPABASE_URL,
    settings.SUPABASE_SERVICE_ROLE_KEY
)
