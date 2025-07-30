from sqlmodel import Field, SQLModel


class Status(SQLModel, table=True):  # type: ignore
    status: str = Field(primary_key=True)
    message: str
    color: str
    order_index: int
