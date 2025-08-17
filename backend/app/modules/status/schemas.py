from pydantic import BaseModel


class StatusRead(BaseModel):
    status: str
    message: str
    color: str
    order_index: int

    model_config = {"from_attributes": True}
