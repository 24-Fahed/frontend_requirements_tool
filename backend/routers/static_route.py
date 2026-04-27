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
    # .vue 不在 FileResponse 默认的 MIME 映射表中，显式指定为 text/plain
    # 以确保前端 fetch .vue 文件时 res.text() 能正确获取源码内容
    if path.endswith('.vue'):
        return FileResponse(full_path, media_type='text/plain')
    return FileResponse(full_path)
