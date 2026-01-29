from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings


if settings.DB_USER and settings.DB_PASSWORD:
    SQLALCHEMY_DATABASE_URL = (
        f"mssql+pyodbc://{settings.DB_USER}:{settings.DB_PASSWORD}"
        f"@{settings.DB_HOST}:1433/{settings.DB_NAME}"
        f"?driver={settings.DB_DRIVER.replace(' ', '+')}"
    )
else:
    SQLALCHEMY_DATABASE_URL = (
        f"mssql+pyodbc://@{settings.DB_HOST}/{settings.DB_NAME}"
        f"?driver={settings.DB_DRIVER.replace(' ', '+')}"
        f"&trusted_connection=yes"
    )


engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_pre_ping=True
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
