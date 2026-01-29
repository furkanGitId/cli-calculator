from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

is_local = settings.DB_HOST.lower().startswith("(localdb)") or settings.DB_HOST.lower() in ["localhost", "127.0.0.1"]

if is_local:
    # Always use trusted connection for local
    SQLALCHEMY_DATABASE_URL = (
        f"mssql+pyodbc://@{settings.DB_HOST}/{settings.DB_NAME}"
        f"?driver={settings.DB_DRIVER.replace(' ', '+')}"
        f"&trusted_connection=yes"
    )
elif settings.DB_USER and settings.DB_PASSWORD:
    # Use SQL login for non-local hosts
    SQLALCHEMY_DATABASE_URL = (
        f"mssql+pyodbc://{settings.DB_USER}:{settings.DB_PASSWORD}"
        f"@{settings.DB_HOST}:1433/{settings.DB_NAME}"
        f"?driver={settings.DB_DRIVER.replace(' ', '+')}"
    )
else:
    # Fallback to trusted connection for non-local if no credentials
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
