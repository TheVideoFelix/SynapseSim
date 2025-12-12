from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import tm_router
from app.core.tms import init_tms

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    init_tms()

app.include_router(tm_router.router)

@app.get("/")
def read_root():
    return {"Hello", "World!"}
