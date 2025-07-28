# app/modules/auth/schemas.py
# Pydantic models (login user)
from pydantic import BaseModel, EmailStr

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


