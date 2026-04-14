import os

from fastapi.responses import FileResponse


class StaticFileServer:
    """开发者组件库静态资源服务"""

    def __init__(self, base_dir: str):
        self.base_dir = base_dir

    def get_file(self, path: str) -> FileResponse:
        full_path = os.path.join(self.base_dir, path)
        if not os.path.isfile(full_path):
            raise FileNotFoundError(f"文件不存在: {path}")
        return FileResponse(full_path)

    def list_files(self, dir_path: str = "") -> list[str]:
        full_path = os.path.join(self.base_dir, dir_path)
        if not os.path.isdir(full_path):
            return []
        return os.listdir(full_path)
