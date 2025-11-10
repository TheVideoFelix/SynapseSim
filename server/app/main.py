from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import ws_tm

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ws_tm.router)

@app.get("/")
def read_root():
    return {"Hello", "World!"}
