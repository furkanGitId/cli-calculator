from fastapi import HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.models.calculator_models import Calculation

def create_calculation(db: Session, expression: str, result: float):
    calc = Calculation(expression=expression, result=result)
    db.add(calc)
    db.commit()
    db.refresh(calc)
    return calc

def update_calculation(db: Session, calc_id: int, expression: str, result: float):
    record = db.query(Calculation).filter(Calculation.id == calc_id).first()

    if not record:
        raise HTTPException(status_code=404, detail="Calculation not found")

    setattr(record, "expression", str(expression))
    setattr(record, "result", float(result))

    db.commit()
    db.refresh(record)
    return record

def get_history(db: Session, skip: int = 0, limit: int = 10):
    return db.query(Calculation).order_by(Calculation.created_at.desc()).offset(skip).limit(limit).all()

def delete_history_by_ids(db: Session, ids: list[int]):
    db.query(Calculation).filter(Calculation.id.in_(ids)).delete(synchronize_session=False)
    db.commit()

def truncate_history(db: Session):
    db.execute(text("TRUNCATE TABLE calculation_history"))
    db.commit()