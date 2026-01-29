class Settings:
    # Database
    DB_USER: str = "sa"
    DB_PASSWORD: str = "YourStrong!Passw0rd"
    DB_HOST: str = "mssql"  # Docker service name
    DB_NAME: str = "CalculatorDB"
    DB_DRIVER: str = "ODBC Driver 17 for SQL Server"

    # App
    APP_NAME: str = "CLI Calculator API"
    APP_ENV: str = "development"  # development | production
    APP_PORT: int = 8000


settings = Settings()
