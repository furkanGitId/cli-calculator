from fastapi import APIRouter,Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.calculator_service import evaluate_expression
from app.schemas.schemas import CalculationCreate, CalculationResponse, CalculationUpdate,DeleteHistoryRequest,TruncateHistoryRequest
from app.crud.crud import create_calculation,get_history, delete_history_by_ids,truncate_history,update_calculation


router = APIRouter(prefix="/calc", tags=["calculations"])

@router.post("/calculate")
def calculate(data: CalculationCreate, db: Session = Depends(get_db)):
    try:
        result_value = evaluate_expression(data.expression)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    # Save to DB
    record = create_calculation(db, data.expression, result_value)
    return {"expression": data.expression, "result": result_value}

@router.put("/calculate/{calc_id}", response_model=CalculationResponse)
def update_existing_calculation(calc_id: int,data: CalculationUpdate,db: Session = Depends(get_db),):
    try:
        result_value = evaluate_expression(data.expression)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    record = update_calculation(db, calc_id, data.expression, result_value)
    return record

@router.get("/history", response_model=list[CalculationResponse])
def history(db: Session = Depends(get_db)):
    try:
        return get_history(db)  
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.delete("/delete_history")
def delete_history(data: DeleteHistoryRequest, db: Session = Depends(get_db)):
    if not data.ids:
        raise HTTPException(status_code=400, detail="No IDs provided")
    try:
        delete_history_by_ids(db, data.ids)
        return {"deleted_ids": data.ids}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@router.delete("/truncate_history")
def truncate_history_endpoint(data: TruncateHistoryRequest, db: Session = Depends(get_db)):
    if not data.confirm:
        raise HTTPException(status_code=400, detail="Truncate not confirmed")
    try:
        truncate_history(db)
        return {"status": "success", "message": "All calculation history truncated"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))