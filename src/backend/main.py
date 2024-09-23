from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import predict, user, logs
import uvicorn


app = FastAPI()

app.include_router(predict.router)
app.include_router(user.router)
app.include_router(logs.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "working"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
