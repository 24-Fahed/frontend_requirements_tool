from fastapi import APIRouter, HTTPException
from typing import Optional

from services.parser import YamlParser, JsonParser
from services.storage import ResultStorage
from services.static import StaticFileServer
from models.result import ResultModel

router = APIRouter(prefix="/api")

# 服务实例（在main.py中注入配置路径后初始化）
yaml_parser = YamlParser()
json_parser = JsonParser()
storage: Optional[ResultStorage] = None
static_server: Optional[StaticFileServer] = None
config_dir: str = ""


def init_services(dev_config_dir: str, output_dir: str):
    global storage, static_server, config_dir
    storage = ResultStorage(output_dir)
    static_server = StaticFileServer(dev_config_dir)
    config_dir = dev_config_dir


@router.get("/requirements")
def get_requirements(category_id: Optional[str] = None):
    file_path = f"{config_dir}/requirements.yaml"
    try:
        data = yaml_parser.parse_requirements(file_path)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="需求配置文件不存在")
    result = data.model_dump()
    if category_id:
        result["categories"] = [c for c in result["categories"] if c["id"] == category_id]
    return result


@router.get("/components")
def get_components():
    file_path = f"{config_dir}/components.json"
    try:
        return json_parser.parse_components(file_path)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="组件描述文件不存在")


@router.get("/default-layout")
def get_default_layout(layout_id: Optional[str] = None):
    file_path = f"{config_dir}/default_layout.json"
    try:
        return json_parser.parse_default_layout(file_path, layout_id)
    except FileNotFoundError:
        return {"layouts": []}


@router.post("/results")
def save_results(result: ResultModel):
    if storage is None:
        raise HTTPException(status_code=500, detail="存储服务未初始化")
    storage.save(result)
    return {"success": True}


@router.get("/results")
def get_results():
    if storage is None:
        raise HTTPException(status_code=500, detail="存储服务未初始化")
    data = storage.load()
    if data is None:
        return {"answers": []}
    return data
