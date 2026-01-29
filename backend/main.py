from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import calculator_routers

app = FastAPI(title="CLI Calculator API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}

app.include_router(calculator_routers.router)