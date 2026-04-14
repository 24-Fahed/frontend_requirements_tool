from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

router = APIRouter(prefix="/static")

base_dir: str = ""


def init_static(dev_config_dir: str):
    global base_dir
    base_dir = dev_config_dir


@router.get("/lib/{path:path}")
def serve_static(path: str) -> FileResponse:
    import os
    full_path = os.path.join(base_dir, "lib", path)
    if not os.path.isfile(full_path):
        raise HTTPException(status_code=404, detail="文件不存在")
    return FileResponse(full_path)
