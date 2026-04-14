import os
import sys
from pathlib import Path
from typing import Optional

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

sys.path.insert(0, str(Path(__file__).parent))

from routers.api import router as api_router, init_services as init_api_services
from routers.static_route import router as static_router, init_static

app = FastAPI(title="需求收集工具", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).parent
DEV_CONFIG_DIR = str(BASE_DIR / "dev-config")
OUTPUT_DIR = str(BASE_DIR / "output")
FRONTEND_DIST_DIR = str(BASE_DIR / "frontend-dist")

init_api_services(DEV_CONFIG_DIR, OUTPUT_DIR)
init_static(DEV_CONFIG_DIR)

app.include_router(api_router)
app.include_router(static_router)


@app.get("/")
def root():
    return FileResponse(os.path.join(FRONTEND_DIST_DIR, "index.html"))


# 前端静态文件（放在最后，作为fallback）
if os.path.isdir(FRONTEND_DIST_DIR):
    app.mount("/assets", StaticFiles(directory=os.path.join(FRONTEND_DIST_DIR, "assets")), name="assets")


if __name__ == "__main__":
    import uvicorn
    host = os.environ.get("HOST", "0.0.0.0")
    port = int(os.environ.get("PORT", "8000"))
    uvicorn.run("main:app", host=host, port=port, reload=False)
