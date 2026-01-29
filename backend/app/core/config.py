class Settings:
    # Database
    # Local development default
    DB_HOST: str = "(localdb)\\MSSQLLocalDB"  

    # Uncomment or override for Docker / remote:
    # DB_HOST: str = "mssql"  

    DB_USER: str = "sa"  # only used for non-local hosts
    DB_PASSWORD: str = "YourStrong!Passw0rd"  # only used for non-local hosts
    DB_NAME: str = "CalculatorDB"
    DB_DRIVER: str = "ODBC Driver 17 for SQL Server"

    # App
    APP_NAME: str = "CLI Calculator API"
    APP_ENV: str = "development"
    APP_PORT: int = 8000

settings = Settings()
