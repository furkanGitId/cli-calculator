from datetime import datetime
from pydantic import BaseModel

class CalculationCreate(BaseModel):
    expression: str

class CalculationUpdate(BaseModel):
    expression: str

class CalculationResponse(BaseModel):
    id: int
    expression: str
    result: float
    created_at: datetime
    updated_at: datetime

class DeleteHistoryRequest(BaseModel):
    ids: list[int]

class TruncateHistoryRequest(BaseModel):
    confirm: bool  

    class Config:
        from_attributes = True