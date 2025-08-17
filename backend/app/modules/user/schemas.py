import enum
from uuid import UUID

from pydantic import BaseModel, EmailStr


class RoleEnum(str, enum.Enum):
    admin = "admin"
    surgical_team = "surgical_team"


class UserRead(BaseModel):
    id: UUID
    name: str
    email: EmailStr
    role: RoleEnum

    model_config = {
        "from_attributes": True  # enables .model_validate() from ORM objects, This tells Pydantic how to interpret ORM objects
    }
