# CLI Calculator - Full Stack Application

A complete full-stack calculator application with a FastAPI backend, React frontend, and SQL Server database. This application allows users to perform calculations and maintain a history of all calculations.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
- [Running with Docker](#running-with-docker)
- [GitHub Repository Setup](#github-repository-setup)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Development](#development)

---

## 🎯 Project Overview

**CLI Calculator** is a microservices-based application that provides:
- **Backend API** for performing calculations and managing calculation history
- **Frontend UI** built with React for user interaction
- **SQL Server Database** for persistent storage of calculation records
- **Docker Containerization** for easy deployment and scaling

---

## 🛠️ Technology Stack

### Backend
- **FastAPI** - Modern Python web framework for APIs
- **Uvicorn** - ASGI server for running FastAPI
- **SQLAlchemy** - ORM for database operations
- **Pydantic** - Data validation and serialization
- **PyODBC** - Database connectivity to SQL Server
- **Alembic** - Database migrations

### Frontend
- **React 19** - JavaScript library for building UI
- **Bootstrap 5** - CSS framework for styling
- **Axios** - HTTP client for API calls
- **React Scripts** - Build tools for React applications

### Database
- **SQL Server 2022** - Enterprise-grade relational database
- **MSSQL Tools** - Command-line tools for SQL Server

### DevOps
- **Docker** - Containerization platform
- **Docker Compose** - Multi-container orchestration

---

## 📁 Folder Structure

```
cli-calculator/
│
├── README.md                          # This file - Project documentation
│
├── docker-compose.yml                 # Docker Compose configuration for multi-container setup
│
├── backend/                           # FastAPI Backend Application
│   ├── dockerfile                     # Docker image configuration for backend
│   ├── main.py                        # Application entry point
│   ├── requirements.txt               # Python dependencies
│   │
│   └── app/                           # Main application package
│       ├── core/                      # Core application settings
│       │   ├── config.py              # Configuration and environment variables
│       │   ├── database.py            # Database connection and session management
│       │   └── __pycache__/           # Compiled Python files
│       │
│       ├── crud/                      # CRUD operations (Create, Read, Update, Delete)
│       │   ├── crud.py                # Database operations for calculations
│       │   └── __pycache__/
│       │
│       ├── models/                    # SQLAlchemy Database Models
│       │   ├── calculator_models.py   # Definition of calculation_history table
│       │   └── __pycache__/
│       │
│       ├── routers/                   # API Endpoints/Routes
│       │   ├── calculator_routers.py  # Routes for calculation endpoints
│       │   └── __pycache__/
│       │
│       ├── schemas/                   # Pydantic Data Schemas
│       │   ├── schemas.py             # Request/Response data models
│       │   └── __pycache__/
│       │
│       └── services/                  # Business Logic Layer
│           ├── calculator_service.py  # Calculation logic and business rules
│           └── __pycache__/
│
├── db/                                # Database Scripts and Migrations
│   └── calculation_history.sql        # Initial database schema and setup script
│
├── frontend/                          # React Frontend Application
│   └── cli-calculator-ui/             # React application root
│       ├── dockerfile                 # Multi-stage Docker build for React app
│       ├── package.json               # Node.js dependencies and scripts
│       │
│       ├── public/                    # Static public assets
│       │   ├── index.html             # Main HTML file
│       │   ├── manifest.json          # PWA manifest configuration
│       │   └── robots.txt             # SEO robots configuration
│       │
│       └── src/                       # React source code
│           ├── index.js               # React app entry point
│           ├── index.css              # Global styles
│           ├── App.js                 # Main App component
│           ├── App.css                # App component styles
│           ├── App.test.js            # App component tests
│           ├── reportWebVitals.js     # Performance metrics
│           ├── setupTests.js          # Test configuration
│           │
│           ├── api/                   # API Integration Layer
│           │   └── calculatorApi.js   # Axios client for backend API calls
│           │
│           ├── components/            # Reusable React Components
│           │   ├── CalculatorForm.jsx # Calculator input form component
│           │   └── HistoryTable.jsx   # Calculation history table component
│           │
│           ├── hooks/                 # Custom React Hooks
│           │   └── useCalculationHistory.js  # Hook for managing calculation history
│           │
│           └── pages/                 # Page Components
│               └── HistoryPage.jsx    # Page displaying calculation history
│
└── .vscode/                           # VS Code Workspace Settings
    ├── settings.json                  # Workspace editor and extension settings
    ├── extensions.json                # Recommended VS Code extensions
    └── launch.json                    # Debug configurations (if configured)
```

---

## 🚀 Getting Started

### Prerequisites

Before you start, ensure you have installed:
- **Docker** (version 20.10 or higher)
- **Docker Compose** (version 1.29 or higher)
- **Git** (for version control)
- **VS Code** (optional, for development)

**Installation Links:**
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Git](https://git-scm.com/)
- [VS Code](https://code.visualstudio.com/)

### Quick Start

1. **Clone the Repository**
   ```bash
   git clone https://github.com/YOUR-USERNAME/cli-calculator.git
   cd cli-calculator
   ```

2. **Build and Start Services**
   ```bash
   docker compose up -d
   ```

3. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

4. **Stop Services**
   ```bash
   docker compose down
   ```

---

## 🐳 Running with Docker

### Docker Compose Configuration

The `docker-compose.yml` file orchestrates three main services:

#### 1. **MSSQL Service** (Database)
```yaml
mssql:
  image: mcr.microsoft.com/mssql/server:2022-latest
  container_name: cli-calculator-mssql
  environment:
    ACCEPT_EULA: "Y"
    SA_PASSWORD: "YourStrong!Passw0rd"
  ports:
    - "1433:1433"
  volumes:
    - mssql-data:/var/opt/mssql
  healthcheck: Ensures database is ready before other services start
```
- **Port**: 1433
- **Username**: sa
- **Password**: YourStrong!Passw0rd
- **Database**: CalculatorDB

#### 2. **MSSQL-Init Service** (Database Initialization)
Runs the `calculation_history.sql` script to initialize the database schema on startup.

#### 3. **Backend Service** (FastAPI)
```yaml
backend:
  build: ./backend
  container_name: cli-calculator-backend
  ports:
    - "8000:8000"
  depends_on:
    mssql:
      condition: service_healthy
  volumes:
    - ./backend:/app
```
- **Port**: 8000
- **Framework**: FastAPI with Uvicorn
- **Auto-reload**: Enabled for development

#### 4. **Frontend Service** (React)
```yaml
frontend:
  build: ./frontend/cli-calculator-ui
  container_name: cli-calculator-frontend
  ports:
    - "3000:3000"
  depends_on:
    - backend
```
- **Port**: 3000
- **Framework**: React with Nginx (production)
- **Build**: Multi-stage Docker build for optimized production image

### Docker Network

All services communicate through a dedicated network: `calculator-network`

---

## 📝 Detailed Component Breakdown

### Backend (FastAPI)

#### `/app/core/config.py`
**Purpose**: Centralized configuration management
```python
- DB_USER: Database username
- DB_PASSWORD: Database password
- DB_HOST: Docker service name or IP
- DB_NAME: Database name
- DB_DRIVER: ODBC driver for SQL Server
- APP_NAME: Application name
- APP_ENV: Environment (development/production)
```

#### `/app/core/database.py`
**Purpose**: Database connection and session management
- Handles SQLAlchemy engine creation
- Manages database sessions
- Provides dependency injection for routes

#### `/app/models/calculator_models.py`
**Purpose**: SQLAlchemy ORM models
```python
CalculationHistory:
  - id: Auto-incrementing primary key
  - expression: Math expression string
  - result: Calculation result
  - created_at: Timestamp of creation
  - updated_at: Timestamp of last update
```

#### `/app/schemas/schemas.py`
**Purpose**: Pydantic models for request/response validation
```python
- CalculationCreate: Input for new calculation
- CalculationResponse: Output format with all fields
- DeleteHistoryRequest: Batch delete request
- TruncateHistoryRequest: Clear history confirmation
```

#### `/app/crud/crud.py`
**Purpose**: Database operations
- Create calculation records
- Read history (single or all)
- Update records
- Delete individual or batch records
- Clear all history

#### `/app/routers/calculator_routers.py`
**Purpose**: API endpoints
```
POST   /api/calculate          - Perform calculation
GET    /api/history            - Get calculation history
DELETE /api/history/{id}       - Delete specific record
DELETE /api/history            - Clear all history
GET    /docs                   - Swagger API documentation
```

#### `/app/services/calculator_service.py`
**Purpose**: Business logic and calculation engine
- Evaluate mathematical expressions safely
- Validate inputs
- Handle errors gracefully

### Database (SQL Server)

#### `/db/calculation_history.sql`
**Purpose**: Database schema initialization script
```sql
- Creates CalculatorDB database
- Creates calculation_history table with columns:
  * id: INT (Identity/Primary Key)
  * expression: NVARCHAR(255)
  * result: FLOAT
  * created_at: DATETIME2 (auto-set to current time)
  * updated_at: DATETIME2 (auto-set to current time)
```

### Frontend (React)

#### `/frontend/cli-calculator-ui/src/api/calculatorApi.js`
**Purpose**: HTTP client for backend API communication
- Configures Axios with base URL
- Provides methods for:
  - performCalculation(expression)
  - getHistory()
  - deleteHistoryItem(id)
  - clearHistory()

#### `/frontend/cli-calculator-ui/src/hooks/useCalculationHistory.js`
**Purpose**: Custom React hook for state management
- Manages calculation history state
- Handles API calls
- Provides refetch functionality

#### `/frontend/cli-calculator-ui/src/components/CalculatorForm.jsx`
**Purpose**: Calculator input form component
- Input field for mathematical expressions
- Calculate and Clear buttons
- Displays current result
- Error handling and validation

#### `/frontend/cli-calculator-ui/src/components/HistoryTable.jsx`
**Purpose**: Display and manage calculation history
- Table showing all past calculations
- Delete individual records
- Clear all history button
- Displays expression, result, and timestamp

#### `/frontend/cli-calculator-ui/src/pages/HistoryPage.jsx`
**Purpose**: History page layout
- Displays HistoryTable component
- Page structure and styling

### Dockerfiles

#### `/backend/dockerfile`
**Purpose**: Build Docker image for FastAPI backend
```dockerfile
Base Image: python:3.11-slim
Working Directory: /app
Installs:
  - System dependencies for SQL Server ODBC 17
  - Python dependencies from requirements.txt
Exposes Port: 8000
Command: uvicorn main:app --host 0.0.0.0 --port 8000
```

#### `/frontend/cli-calculator-ui/dockerfile`
**Purpose**: Build Docker image for React frontend
```dockerfile
Build Stage:
  - Base Image: node:alpine
  - Install npm dependencies
  - Run npm build
  
Production Stage:
  - Base Image: nginx:alpine
  - Copy built React app to nginx html directory
  - Configure nginx for SPA routing
Exposes Port: 80
```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory (optional):
```env
# Database
DB_USER=sa
DB_PASSWORD=YourStrong!Passw0rd
DB_HOST=mssql
DB_NAME=CalculatorDB

# Application
APP_ENV=development
APP_PORT=8000
```

### Database Connection String
```
Driver=ODBC Driver 17 for SQL Server;
Server=mssql,1433;
Database=CalculatorDB;
UID=sa;
PWD=YourStrong!Passw0rd;
```

---

## 📚 API Documentation

Once the application is running, visit: `http://localhost:8000/docs`

**Available Endpoints:**

1. **Calculate**
   ```
   POST /api/calculate
   Body: { "expression": "2 + 2 * 10" }
   Response: { "id": 1, "expression": "2 + 2 * 10", "result": 22.0, ... }
   ```

2. **Get History**
   ```
   GET /api/history
   Response: [ { "id": 1, "expression": "2 + 2", "result": 4.0, ... }, ... ]
   ```

3. **Delete Record**
   ```
   DELETE /api/history/{id}
   ```

4. **Clear All History**
   ```
   DELETE /api/history
   Body: { "confirm": true }
   ```

---

## 💻 Development

### Backend Development

1. **Install Python Dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Run Backend Locally**
   ```bash
   uvicorn main:app --reload
   ```

3. **Access API Documentation**
   - http://localhost:8000/docs (Swagger UI)
   - http://localhost:8000/redoc (ReDoc)

### Frontend Development

1. **Install Node Dependencies**
   ```bash
   cd frontend/cli-calculator-ui
   npm install
   ```

2. **Run Frontend Locally**
   ```bash
   npm start
   ```
   - Runs on http://localhost:3000
   - Auto-reloads on file changes

3. **Build for Production**
   ```bash
   npm run build
   ```

4. **Run Tests**
   ```bash
   npm test
   ```

### Common Docker Commands

```bash
# View running containers
docker ps

# View logs for specific service
docker logs cli-calculator-backend
docker logs cli-calculator-frontend
docker logs cli-calculator-mssql

# Follow logs in real-time
docker logs -f cli-calculator-backend

# Access container shell
docker exec -it cli-calculator-backend bash

# Remove all services and volumes
docker compose down -v

# Rebuild services
docker compose up -d --build
```

---

## 🐙 GitHub Repository Setup

### Create GitHub Repository

1. **Go to GitHub**: https://github.com/new

2. **Fill Repository Details**:
   - **Repository Name**: `cli-calculator`
   - **Description**: `A full-stack calculator application with FastAPI backend, React frontend, and SQL Server database`
   - **Visibility**: Public (recommended) or Private
   - **Initialize**: Do NOT initialize with README (we already have one)

3. **Create Repository**

### Push Local Repository to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Full-stack CLI calculator application"

# Add remote repository
git remote add origin https://github.com/YOUR-USERNAME/cli-calculator.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

### Clone from GitHub

```bash
git clone https://github.com/YOUR-USERNAME/cli-calculator.git
cd cli-calculator
docker compose up -d
```

### Repository Best Practices

1. **Create `.gitignore` File** - Exclude unnecessary files:
   ```
   __pycache__/
   *.pyc
   .env
   node_modules/
   build/
   dist/
   .DS_Store
   *.log
   .venv/
   venv/
   ```

2. **Add GitHub Actions CI/CD** (optional)
   - Create `.github/workflows/docker-build.yml`
   - Auto-build and push Docker images

3. **Add License**
   - Choose a license: MIT, Apache 2.0, etc.

4. **Create Branch Protection Rules**
   - Protect main branch
   - Require pull request reviews

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add your feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Submit a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 📞 Support

For issues and questions:
- Open an Issue on GitHub
- Check existing discussions
- Review API documentation at http://localhost:8000/docs

---

## 🎓 Learning Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [SQLAlchemy Documentation](https://www.sqlalchemy.org/)
- [Docker Documentation](https://docs.docker.com/)
- [SQL Server Documentation](https://docs.microsoft.com/sql/)

---

### **1\. Basic Docker Compose Commands**


*   **Start services defined in `docker-compose.yml`:**
    
```bash
docker-compose up
```

*   **Start in detached mode (background):**
    
```bash
docker-compose up -d
```

*   **Stop services:**
    

```bash
docker-compose down 
```

*   **Stop and remove all containers, networks, and volumes:**
    

```bash
docker-compose down --volumes
```

*   **List running services/containers:**
    

```bash
docker-compose ps
```

* * *

### **2\. Viewing Logs**

*   **View logs for all services:**
    

```bash
docker-compose logs
```

*   **View logs with real-time updates:**
    

```bash
docker-compose logs -f
```

*   **View logs for a specific service:**
    

```bash
docker-compose logs -f <service_name> 
```

*   **Limit log output to last N lines:**
    

```bash
docker-compose logs --tail=50 <service_name> 
```

* * *

### **3\. Accessing Shell in a Container**

*   **Open a shell inside a running service:**
    
```bash
docker-compose exec <service_name> sh
```

*   **If the container has bash:**
    
```bash
docker-compose exec <service_name> bash
```

*   **Run a one-time command in a service container:**

```bash
docker-compose run <service_name> <command>
```

Example:
```bash
docker-compose run web ls -l
```

* * *

### **4\. Advanced Docker Compose Commands**

*   **Rebuild images before starting (useful if Dockerfile changed):**
    
```bash
docker-compose up --build
```

*   **Stop and remove containers, networks, and rebuild:**
    
```bash
docker-compose down --rmi all --volumes --remove-orphans
```

*   **Run services with a specific profile (if defined in `docker-compose.yml`):**

```bash
docker-compose --profile <profile_name> up
```

*   **Override environment variables (without editing yml):**

```bash
docker-compose run -e ENV_VAR=value <service_name> <command>
```

* * *

### **5\. Health Check**

*   **Define health check in `docker-compose.yml`:**
    
```bash
services:
  web:
    image: nginx
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost"]
      interval: 30s
      timeout: 10s
      retries: 3
```
      
*   **Check container health status:**
    
```bash
docker ps
```

Look under the **STATUS** column for `healthy` or `unhealthy`.

*   **Inspect health check in detail:**
  
```bash
docker inspect --format='{{json .State.Health}}' <container_id>
```    

*   **Watch logs for health check events:**

```bash
docker-compose logs -f <service_name>
```

* * *

### **6\. Miscellaneous Useful Commands**

*   **List all images created by Compose:**
    
```bash
docker-compose images
```

*   **Remove stopped containers:**
    
```bash
docker-compose rm
```

*   **Run command on all services:**

```bash
docker-compose run --rm <service_name> <command>
```

# Docker Compose Command Reference

This table organizes common Docker Compose commands by category, providing the command syntax and a brief description or example of its use.

| Category | Command | Description / Example |
| :--- | :--- | :--- |
| **Start Services** | `docker-compose up` | Start services in the foreground. |
| | `docker-compose up -d` | Start services in detached mode (background). |
| **Stop Services** | `docker-compose down` | Stop all services. |
| | `docker-compose down --volumes` | Stop services and remove associated volumes (including anonymous volumes). |
| **Rebuild Services** | `docker-compose up --build` | Rebuild images before starting the services. |
| | `docker-compose down --rmi all --volumes --remove-orphans` | Clean everything (stop, remove images, volumes, and orphaned containers) and prepare for a fresh rebuild. |
| **Service Status** | `docker-compose ps` | List running services and their container status. |
| **Logs** | `docker-compose logs` | View logs for all services. |
| | `docker-compose logs -f` | Follow logs in real time. |
| | `docker-compose logs -f <service_name>` | Follow logs for a specific service. |
| | `docker-compose logs --tail=50 <service_name>` | Show the last 50 lines of logs for a service. |
| **Shell Access** | `docker-compose exec <service_name> sh` | Open a shell inside a running container. |
| | `docker-compose exec <service_name> bash` | Open a bash shell if available inside the container. |
| | `docker-compose run <service_name> <command>` | Run a one-time command in a container (e.g., a migration script). |
| **Health Check (YML)** | `healthcheck: test: ["CMD","curl","-f","http://localhost"] interval: 30s timeout: 10s retries: 3` | Example YAML configuration to define a health check for a service. |
| **Check Health Status** | `docker ps` | Shows container health under the `STATUS` column (e.g., `(healthy)` or `(unhealthy)`). |
| | `docker inspect --format='{{json .State.Health}}' <container_id_or_name>` | Get detailed health check information for a specific container. |
| **Profiles & Environment** | `docker-compose --profile <name> up` | Start services defined under a specific profile in the Compose file. |
| | `docker-compose run -e ENV_VAR=value <service_name> <command>` | Override environment variables for a single run command. |
| **Miscellaneous** | `docker-compose images` | List images created by Compose. |
| | `docker-compose rm` | Remove stopped containers. |
| | `docker-compose run --rm <service_name> <command>` | Run a command and automatically remove the container after execution. |


---

**Last Updated**: January 29, 2026
**Version**: 1.0.0
