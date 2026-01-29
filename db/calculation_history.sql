IF NOT EXISTS (
    SELECT 1
    FROM sys.databases
    WHERE name = 'CalculatorDB'
)
BEGIN
    CREATE DATABASE CalculatorDB;
END
GO

USE CalculatorDB;
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.tables
    WHERE name = 'calculation_history'
      AND schema_id = SCHEMA_ID('dbo')
)
BEGIN
    CREATE TABLE dbo.calculation_history (
        id INT IDENTITY(1,1) PRIMARY KEY,
        expression NVARCHAR(255) NOT NULL,
        result FLOAT NOT NULL,
        created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        updated_at DATETIME2 NOT NULL DEFAULT GETDATE()
    );
END
GO
